from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime

app = Flask(__name__)
CORS(app)

def is_interesting_option(opt, underlying_price):
    volume = opt.get('volume', 0)
    oi = opt.get('openInterest', 0)
    bid = opt.get('bid', 0)
    ask = opt.get('ask', 0)
    strike = opt.get('strike', 0)
    

    if bid is None or ask is None:
        return False

    mid_price = (bid + ask) / 2
    premium = volume * mid_price * 100

    otm = abs(strike - underlying_price) / underlying_price > 0.2
    high_premium = premium > 100_000
    new_interest = volume > oi and volume > 500

    return new_interest and (high_premium or (otm))

@app.route('/api/unusual', methods=['GET'])
def get_unusual_activity():
    ticker_symbol = request.args.get('ticker', 'AAPL').upper()  # Default to AAPL if nothing passed
    ticker = yf.Ticker(ticker_symbol)

    try:
        underlying_price = ticker.history(period="1d")['Close'].iloc[-1]
    except Exception as e:
        return jsonify({"error": f"Could not retrieve data for {ticker_symbol}: {str(e)}"}), 400

    unusual = []

    for date in ticker.options:
        calls = ticker.option_chain(date).calls
        puts = ticker.option_chain(date).puts

        for opt in calls.itertuples(index=False):
            opt_data = opt._asdict()
            opt_data['expiration'] = date
            if is_interesting_option(opt_data, underlying_price):
                opt_data['type'] = 'call'
                unusual.append(opt_data)

        for opt in puts.itertuples(index=False):
            opt_data = opt._asdict()
            opt_data['expiration'] = date
            if is_interesting_option(opt_data, underlying_price):
                opt_data['type'] = 'put'
                unusual.append(opt_data)

    return jsonify({"unusualOptions": unusual})

if __name__ == '__main__':
    app.run(debug=True, port=8080)
