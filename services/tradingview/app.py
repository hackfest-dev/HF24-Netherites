import urllib.parse
import requests
from flask import Flask, request, jsonify
from tradingview_ta import TA_Handler

app = Flask(__name__)

@app.route('/tradingview', methods=['GET'])
def get_analysis():
    company_name = request.args.get('company_name')
    interval = request.args.get('interval')

    if not all([company_name, interval]):
        return 'Missing required parameters', 400

    try:
        encoded_company_name = urllib.parse.quote_plus(company_name)

        # Retrieve symbol from Screener API
        url = f"https://www.screener.in/api/company/search/?q={encoded_company_name}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            symbol = data[0]['symbol']  # Extract symbol from API response
        else:
            return jsonify({"error": "Failed to fetch data from Screener API"}), response.status_code

        # Get TradingView analysis
        handler = TA_Handler(
            symbol=symbol,
            exchange="NSE",
            screener="india",
            interval=interval
        )
        analysis = handler.get_analysis()

        return jsonify({
            'opening_price': analysis.indicators['open'],
            'closing_price': analysis.indicators['close'],
            'momentum': analysis.indicators['Mom'],
            'rsi': analysis.indicators['RSI'],
            'macd': analysis.indicators['MACD.macd'],
            'moving_average': analysis.indicators['Recommend.MA'],
            'lower_bb': analysis.indicators['BB.lower'],
            'upper_bb': analysis.indicators['BB.upper'],
            'stochastic': analysis.indicators['Stoch.K'],
            'adx': analysis.indicators['ADX'],
            'volume': analysis.indicators['volume']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003)
