import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from langchain_google_genai import GoogleGenerativeAI


def get_response(context,prompt):
    try:
        context_str = ' '.join(context)
        api_key = os.getenv('GOOGLE_API_KEY')
        llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
        response = llm.invoke(context_str +prompt)
        return response

    except Exception as e:
        return str(e)