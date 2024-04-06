import json
from flask import Flask, jsonify,request
from rag import getRag

app = Flask(__name__)

@app.route('/get_documents', methods=['POST'])
def get_documents():
    data = request.json
    context = data['context']
    query = data['query']

    context_filtered = []

    for ctx in context:
        try:
            text = ctx['text'] 
            url = ctx['url']
            title = ctx['title']
            description = ctx['description']
            favicon = ctx['favicon']
            context_filtered.append({'text': text, 'url': url, 
                                        'title': title, 'description': description, 'favicon': favicon
                                     })
        except:
            pass

    # print(context)
    docs = getRag(query, context_filtered)

  
    return jsonify(docs)

if __name__ == '__main__':
    app.run(port=5002, debug=True)
