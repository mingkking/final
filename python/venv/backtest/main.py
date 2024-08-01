import oracledb
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from technical_indicators.indicators import add_technical_indicators
from data_processing.data_processor import preprocess_data
from models.lstm_model import prepare_data_for_lstm, train_lstm_model, evaluate_lstm_model, build_lstm_model
import logging
from datetime import datetime, timedelta

oracledb.init_oracle_client()

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_connection(): #데이터베이스 연결에 필요한 함수 
    try:
        connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
        logger.info("Database connection established successfully.")
        return connection
    except oracledb.Error as e:
        logger.error(f"Error connecting to Oracle Database: {e}")
        return None

def get_stock_data(connection, stock_name): # 데이터베이스에 있는 값들을 가져오는 함수
    cursor = connection.cursor()
    one_year_ago = datetime.now() - timedelta(days=365) # 1년치 데이터 기간 설정
    query = """
        SELECT record_date, stock_code, name, stock_type, closing_price, opening_price, high_price, low_price
        FROM STOCK 
        WHERE name = :name
        AND record_date >= :start_date
        ORDER BY record_date
    """
    cursor.execute(query, name=stock_name, start_date=one_year_ago)
    columns = ['record_date', 'stock_code', 'name', 'stock_type', 'closing_price', 'opening_price', 'high_price', 'low_price']
    #판다스에 있는 열에 있는 값들을 설정
    data = cursor.fetchall()
    return pd.DataFrame(data, columns=columns)
    #데이터들을 판다스 데이터 프레임 형식으로 생성후 리턴

# def predict_future(model, scaler, last_sequence, days): #머신 러닝 가격 예측 함수
#     current_sequence = last_sequence
#     predictions = []
#     for _ in range(days):
#         current_sequence_scaled = scaler.transform(current_sequence[:, :-1])
#         current_sequence_reshaped = current_sequence_scaled.reshape((1, current_sequence_scaled.shape[0], current_sequence_scaled.shape[1]))
#         prediction = model.predict(current_sequence_reshaped)
        
#         # NaN 값 처리
#         pred_prob = float(prediction[0][0])
#         if np.isnan(pred_prob):
#             pred_prob = 0.5  # 또는 다른 적절한 기본값
        
#         predictions.append({
#             'predicted_probability': pred_prob,
#             'predicted_movement': 'Up' if pred_prob > 0.5 else 'Down'
#         })
        
#         # 새로운 예측값을 시퀀스에 추가
#         new_data_point = np.zeros((1, current_sequence.shape[1]))
#         new_data_point[0, :-1] = current_sequence_scaled[-1]
#         new_data_point[0, -1] = pred_prob
#         current_sequence = np.vstack((current_sequence[1:], new_data_point))
    
#     return predictions

def predict_future(model, scaler, last_sequence, days):
    current_sequence = last_sequence
    predictions = []
    for _ in range(days):
        current_sequence_scaled = scaler.transform(current_sequence)
        current_sequence_reshaped = current_sequence_scaled.reshape((1, current_sequence_scaled.shape[0], current_sequence_scaled.shape[1]))
        prediction = model.predict(current_sequence_reshaped)
        
        # 스케일된 예측값을 원래 스케일로 되돌림
        pred_scaled = np.zeros(1, current_sequence_scaled.shape[1])
        pred_scaled[0,-1] = prediction[0,0]
        pred_return = scaler.inverse_transform(pred_scaled)[0,-1]
        predictions.append({
            'predicted_return': pred_return,
            'predicted_movement': 'Up' if pred_return > 0 else 'Down'
        })
        
        # 새로운 예측값을 시퀀스에 추가
        new_data_point = np.zeros_like(current_sequence[-1])
        new_data_point[:-1] = current_sequence[-1, :-1]
        new_data_point[-1] = pred_return
        current_sequence = np.vstack((current_sequence[1:], new_data_point.reshape(1, -1)))
    
    return predictions

@app.route('/analyze', methods=['POST','GET'])
def analyze_stock():
    app.logger.info(f"Received request: {request.method} {request.url}")
    app.logger.info(f"Request data: {request.json}")
    if request.method == 'POST':
        try:
            data = request.json
            logger.info(f"Received data: {data}")
            name = data['stockName']
            start_date = datetime.strptime(data['startDate'], '%Y-%m-%d')
            end_date = datetime.strptime(data['endDate'], '%Y-%m-%d')
            
            connection = create_connection()
            if connection is None:
                return jsonify({'error': '데이터베이스 연결 실패'}), 500

            df = get_stock_data(connection, name)
            
            if df.empty:
                return jsonify({'error': f'{name} 주식의 데이터가 부족합니다.'}), 400

            df = preprocess_data(df)
            df = add_technical_indicators(df)

            # features = ['closing_price', 'SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']
            # target = 'target'
            # df[target] = (df['closing_price'].shift(-1) > df['closing_price']).astype(int)

            # (X_train, X_test, y_train, y_test), scaler = prepare_data_for_lstm(df, features, target)
            # model, history = train_lstm_model(X_train, y_train)
            # loss, accuracy = evaluate_lstm_model(model, X_test, y_test)

            # logger.info(f"Model trained. Test accuracy: {accuracy:.4f}")
            features = ['closing_price', 'SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']
            target = 'closing_price'  # 종가를 타겟으로 사용

            (X_train, X_test, y_train, y_test), scaler = prepare_data_for_lstm(df, features, target)
            model, history = train_lstm_model(X_train, y_train)
            loss, mae = evaluate_lstm_model(model, X_test, y_test)

            logger.info(f"Model trained. Test MAE: {mae:.4f}")


            # 마지막 10개의 데이터 포인트 사용 (target 포함)
            # last_sequence = df[features + [target]].values[-10:]
            
            # days_to_predict = (end_date - start_date).days + 1
            # predictions = predict_future(model, scaler, last_sequence, days_to_predict)

            # result_data = [
            #     {
            #         'date': (start_date + timedelta(days=i)).strftime('%Y-%m-%d'),
            #         'predicted_probability': round(pred['predicted_probability'], 4),
            #         'predicted_movement': pred['predicted_movement']
            #     }
            #     for i, pred in enumerate(predictions)
            # ]

            # return jsonify({
            #     'processedData': result_data,
            #     'stockName': name,
            #     'startDate': start_date.strftime('%Y-%m-%d'),
            #     'endDate': end_date.strftime('%Y-%m-%d'),
            #     'modelAccuracy': round(float(accuracy), 4)
            # })
            last_sequence = df[features + ['returns']].values[-10:]
    
            days_to_predict = (end_date - start_date).days + 1
            predictions = predict_future(model, scaler, last_sequence, days_to_predict)

            result_data = [
                {
                    'date': (start_date + timedelta(days=i)).strftime('%Y-%m-%d'),
                    'predicted_return': round(pred['predicted_return'] * 100, 2),  # 백분율로 변환
                    'predicted_movement': pred['predicted_movement']
                }
                for i, pred in enumerate(predictions)
            ]

            return jsonify({
                'processedData': result_data,
                'stockName': name,
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d'),
                'modelMAE': round(float(mae), 4)
            })

        except Exception as e:
            logger.exception(f"Error occurred: {str(e)}")
            return jsonify({'error': str(e)}), 500
        finally:
            if 'connection' in locals():
                connection.close()
    elif request.method == 'GET':
        return jsonify({'message': 'Please use POST method to analyze stock data'}), 400
if __name__ == '__main__':
    app.run(debug=True, port=5000)