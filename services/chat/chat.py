import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser
from langchain_google_genai import GoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from langchain.prompts import PromptTemplate
from langchain_core.pydantic_v1 import  create_model, BaseModel

def get_response(context, prompt,schema):
    try:
        api_key = os.getenv('GOOGLE_API_KEY')
        #llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
        llm = ChatAnthropic(model="claude-3-opus-20240229", anthropic_api_key=os.getenv('ANTHROPIC_API_KEY'))
        pydantic_model=create_model('model',**schema,__base__=BaseModel)

        parser = JsonOutputParser(pydantic_object=pydantic_model)

        schema_instructions = parser.get_format_instructions()

        prompt = """
        System: Answer the user query based on (or not) on the context provided, depends on the availibility of context. If context is provided, make sure to fully utilize it and provide the most relevant answer. If context is not provided, answer the query based on your knowledge and understanding of the query. Answer as if you are a human and you know the context already.

            User Query : {query}

            Strictly respond only in JSON format not in md and in the following format instructions -
            {schema_instructions}

            Context: {context}
        """.format(query=prompt, schema_instructions=schema_instructions, context=context)

        response = llm.invoke(prompt)

        return response.content.replace('\n','').replace('```json','').replace('```','')

    except Exception as e:
        return str(e)
