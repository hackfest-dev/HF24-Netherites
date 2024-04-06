import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain.schema import Document


def getRag(query, context):
    try:
        # print(query,context)
        
        documents = [Document(page_content=ctx['text'],metadata={
            'url': ctx['url'],
            'title': ctx['title'],
            'description': ctx['description'],
            'favicon': ctx['favicon'],
        }) for ctx in context]

        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        docs = text_splitter.split_documents(documents)
        print('texts done')
        api_key = os.getenv('GOOGLE_API_KEY')
        embeddings = GoogleGenerativeAIEmbeddings(google_api_key=api_key,model='models/embedding-001', task_type='retrieval_query')
        retriever = FAISS.from_documents(docs, embeddings).as_retriever()
        print('retriever done')
        docs = retriever.get_relevant_documents(query)
   
        return [{
            'text': d.page_content,
            'url': d.metadata['url'],
            'title': d.metadata['title'],
            'description': d.metadata['description'],
            'favicon': d.metadata['favicon'],

        } for d in docs]


    except Exception as e:
        return str(e)