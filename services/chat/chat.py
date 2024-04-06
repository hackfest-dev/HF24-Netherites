import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.pydantic_v1 import  create_model

def get_response(context, prompt,schema):
    try:


        api_key = os.getenv('GOOGLE_API_KEY')
        llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
        
        pydantic_model=create_model('model',**schema)

        parser = JsonOutputParser(pydantic_object=pydantic_model)

        prompt = PromptTemplate(
            template="""
            Answer the user query based the context provided(if no context then answer from your knowledge base).

            Strictly respond in :\n {format_instructions}

            User Query : {query}\n

            Context:\n   {context}
            """,
            input_variables=["query", "context"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | llm | parser

        response = chain.invoke({"query": prompt, "context":context})

        

        # template = """
        #     SYSTEM: Answer the user query based the context provided. If no context is provided then use your own knowledge. 
        #     Strictly Respond in correct JSON format and in the following format schema instructions (failing to do so is hazardous) -
        #     {schema} \n
        #     User Query : {prompt} \n
        #     Context:\n {context} """.format(schema=schema, prompt=prompt, context=context)
        
        # print(template)  
        
        # response = llm.invoke(template)

        # print(response)
        return response 

    except Exception as e:
        return str(e)
