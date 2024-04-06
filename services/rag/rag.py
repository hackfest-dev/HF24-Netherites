import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter



def getRag(query, context):
    try:
        # print(query,context)
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        texts = text_splitter.split_text(context)
        api_key = os.getenv('GOOGLE_API_KEY')
        embeddings = GoogleGenerativeAIEmbeddings(google_api_key=api_key,model='models/embedding-001', task_type='retrieval_document')
        retriever = FAISS.from_texts(texts, embeddings).as_retriever()
        docs = retriever.get_relevant_documents(query)
        # print(docs)
        return [d.page_content for d in docs]


    except Exception as e:
        return str(e)