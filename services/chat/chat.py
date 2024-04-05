import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain.output_parsers import PydanticOutputParser
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, validator



def get_response(context, prompt):
    try:
        context_str = ' '.join(context)
        # response = llm.invoke(context_str + prompt)
        api_key = os.getenv('GOOGLE_API_KEY')
        llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)

        class Joke(BaseModel):
            contributions: str=Field(description="give elon musks contributions")


        parser = PydanticOutputParser(pydantic_object=Joke)

        prompt = PromptTemplate(
            template="Answer the user query.\n{format_instructions}\n{query}\n \n based on the following context:\n {context}",
            input_variables=["query"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )
        prompt_and_model = prompt | llm
        output = prompt_and_model.invoke({"query": prompt, "context":context})   
        return str(parser.invoke(output))

    except Exception as e:
        return str(e)

def get_response_from_llm(context,prompt):
    try:
        response = get_response(context, prompt)

        return response

    except Exception as e:
        return str(e)