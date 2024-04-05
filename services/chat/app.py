import json
from flask import Flask, jsonify,request
from chat import get_response

app = Flask(__name__)

@app.route('/generate_response', methods=['POST'])
def generate_response():
    data = json.loads(request.json)
    prompt=data['prompt']
    context = data['context']

    schema_api = {
        'contributions': {
            'type': 'str',
            'value': 'what are contributions of elon musk ?'
        },
    }

    schema_gen = {}

    for key in schema_api:
        if(schema_api[key]['type']== 'str'):
            t = str 
        elif (schema_api[key]['type'] == 'int'):
            t = int
        schema_gen[key] = (t, schema_api[key]['value'])

    # print(schema_gen)
    
    response = get_response(context,prompt,schema_gen)
    return response
if __name__ == '__main__':
    app.run(debug=True, port=5001)
