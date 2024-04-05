import json
from flask import Flask, jsonify,request
from chat import get_response

app = Flask(__name__)

@app.route('/generate_response', methods=['POST'])
def generate_response():
    data = json.loads(request.json)
    prompt=data['prompt']
    context = data['context']
    
    response = get_response(context,prompt)
    print(response)
    return response
if __name__ == '__main__':
    app.run(debug=True, port=5001)
