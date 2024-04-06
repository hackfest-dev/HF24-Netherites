import json
from flask import Flask, jsonify,request
from rag import getRag

app = Flask(__name__)

@app.route('/get_documents', methods=['POST'])
def get_documents():
    data = request.json
    context = data['context']
    query = data['query']

    combined_text = ""
    for ctx in context:
    
        try:
            combined_text += ctx['text'] + "\n"
        except:
            pass

    # print(context)
    docs = getRag(query, combined_text)
  
    return docs

if __name__ == '__main__':
    app.run(port=5002, debug=True)
