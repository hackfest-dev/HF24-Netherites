import json
from flask import Flask, jsonify,request
from chat import get_response
from tradingview_ta import TA_Handler, Interval, Exchange


app = Flask(__name__)

@app.route('/tradingview', methods=['POST'])
def getAnanlysis():
    
    data = request.json

    company_name = data['company_name']

    
    return 0
if __name__ == '__main__':
    app.run(debug=True, port=5001)
