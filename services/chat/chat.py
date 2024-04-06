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
        # llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
        llm = ChatAnthropic(model="claude-3-sonnet-20240229", anthropic_api_key=os.getenv('ANTHROPIC_API_KEY'))
        pydantic_model=create_model('model',**schema,__base__=BaseModel)

        parser = JsonOutputParser(pydantic_object=pydantic_model)

        schema_instructions = parser.get_format_instructions()

        prompt = """
        Answer the user query based on or not on the context provided. Depends on the availibility of context. 
            User Query : {query}

            Strictly respond only in JSON format not in md and in the following format instructions -
            {schema_instructions}

            Context: {context}
        """.format(query=prompt, schema_instructions=schema_instructions, context=context)

        response = llm.invoke(prompt)

        return response.content.replace('\n','').replace('```json','').replace('```','')

    except Exception as e:
        return str(e)
