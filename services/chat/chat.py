import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, create_model



def get_response(context, prompt,schema):
    try:

        api_key = os.getenv('GOOGLE_API_KEY')
        llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
        
        Model2=create_model('Model2',**schema)

        parser = JsonOutputParser(pydantic_object=Model2)

        prompt = PromptTemplate(
            template="Answer the user query based the context provided. Stictly respond in JSON and in the following format instructions -.\n{format_instructions}\n\n\n User Query : {query}\n \n Context:\n {context}",
            input_variables=["query"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )
        prompt_and_model = prompt | llm
        output = prompt_and_model.invoke({"query": prompt, "context":context})
        print(output)   
        print('=======')
        print(str(parser.invoke(output)))
        return output

    except Exception as e:
        return str(e)
