import json
from flask import Flask, jsonify,request
from chat import get_response

app = Flask(__name__)

@app.route('/generate_response', methods=['POST'])
def generate_response():
    data = request.json
    
    prompt=data['prompt'] 
    context = data['context'] 
    schema = data['schema'] 

    schema_api = {
        'contributions': {
            'type': 'str',
            'value': 'what are contributions of elon musk ?'
        },
    }

    schema_gen = {}
    schema = json.loads(schema)
    for key in schema:
        if(schema[key]['type'] == 'str'):
            t = str 
        elif (schema[key]['type'] == 'int'):
            t = int
        elif (schema[key]['type'] == 'list'):
            t = list
        schema_gen[key] = (t, schema[key]['value'])
    
    response = get_response(context,prompt,schema_gen)
    # print(response)
    return response
if __name__ == '__main__':
    app.run(debug=True, port=5001)
