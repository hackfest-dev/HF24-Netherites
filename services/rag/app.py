import json
from flask import Flask, jsonify,request
from rag import get_relevant_documents

app = Flask(__name__)

@app.route('/get_documents', methods=['POST'])
def get_documents():
    data = json.loads(request.json)
    context = data['context']
    query = data['query']
    docs = get_relevant_documents(query, context)
    return jsonify(docs)

if __name__ == '__main__':
    app.run(port=5002, debug=True)
