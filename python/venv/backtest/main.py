import oracledb
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from technical_indicators.indicators import add_technical_indicators
from models.lstm_model import prepare_data_for_lstm, train_lstm_model, evaluate_lstm_model
from data_processing.data_processor import preprocess_data
import logging

oracledb.init_oracle_client()

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_connection():
    try:
        connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
        logger.info("Database connection established successfully.")
        return connection
    except oracledb.Error as e:
        logger.error(f"Error connecting to Oracle Database: {e}")
        return None

@app.route('/analyze', methods=['POST'])
def analyze_stock():
    data = request.json
    print(data)
    name = data['stockName']
    start_date = data['startDate']
    end_date = data['endDate']
    initial_investment = data.get('initialInvestment', 10000)
    rebalance_period = data.get('rebalancePeriod', 'monthly')

    try:
        connection = create_connection()
        if connection is None:
            return jsonify({'error': '데이터베이스 연결 실패'}), 500

        cursor = connection.cursor()
        query = """
            SELECT * FROM INVESTIGATE.STOCK 
            WHERE name = :name
            AND record_date BETWEEN TO_DATE(:start_date, 'YYYY-MM-DD') 
            AND TO_DATE(:end_date, 'YYYY-MM-DD')
        """
        cursor.execute(query, name=name, start_date=start_date, end_date=end_date)
        
        columns = [col[0].lower() for col in cursor.description]
        data = cursor.fetchall()
        df = pd.DataFrame(data, columns=columns)
        
        if df.empty:
            return jsonify({'error': '해당 기간에 데이터가 없습니다.'}), 400

        df = preprocess_data(df)
        df = add_technical_indicators(df)

        features = ['closing_price', 'SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']
        target = 'target'
        df[target] = (df['closing_price'].shift(-1) > df['closing_price']).astype(int)

        if len(df) > 60:
            (X_train, X_test, y_train, y_test), scaler = prepare_data_for_lstm(df, features, target)
            model, history = train_lstm_model(X_train, y_train)
            loss, accuracy = evaluate_lstm_model(model, X_test, y_test)

            latest_data = df[features].iloc[-10:].values
            latest_data_scaled = scaler.transform(latest_data)
            latest_sequence = latest_data_scaled.reshape((1, 10, len(features)))
            prediction_prob = model.predict(latest_sequence)[0][0]

            df['position'] = np.where(df['SMA_20'] > df['EMA_20'], 1, 0)
            df['returns'] = df['closing_price'].pct_change()
            df['strategy_returns'] = df['position'].shift(1) * df['returns']
            
            cumulative_returns = (1 + df['strategy_returns']).cumprod()
            total_return = cumulative_returns.iloc[-1] - 1
            sharpe_ratio = np.sqrt(252) * df['strategy_returns'].mean() / df['strategy_returns'].std()

            result_data = df[['record_date', 'closing_price', 'SMA_20', 'EMA_20', 'RSI_14']].to_dict('records')

            return jsonify({
                'processedData': result_data,
                'predictionProbability': float(prediction_prob),
                'totalReturn': float(total_return),
                'sharpeRatio': float(sharpe_ratio),
                'modelAccuracy': float(accuracy)
            })
        else:
            return jsonify({'error': '데이터가 충분하지 않습니다. 최소 60개의 데이터 포인트가 필요합니다.'}), 400

    except Exception as e:
        logger.exception(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)