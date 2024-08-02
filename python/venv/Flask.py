from flask import Flask, jsonify, request
from flask_cors import CORS
import oracledb
import json
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from backtest.technical_indicators.indicators import add_technical_indicators
from backtest.data_processing.data_processor import preprocess_data
from backtest.models.lstm_model import prepare_data_for_lstm, train_lstm_model, evaluate_lstm_model, build_lstm_model
import logging
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Oracle 클라이언트 초기화
oracledb.init_oracle_client()

FEATURES = ['closing_price', 'SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']

# JSON 파일 경로 정의 (상대 경로)
json_file_path_all_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'allDataSelect', 'budongsanAllData.txt')
json_file_path_map_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'mapDataSelect', 'budongsanMapData.txt')
json_file_path_school_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'schoolSelect', 'schoolData.txt')
json_file_path_store_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'storeId', 'storeIdData.txt')
json_file_path_busStation_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'busStation', 'busStationData.txt')

def get_db_connection():
    try:
        connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
        logger.info("Database connection established successfully.")
        return connection
    except oracledb.DatabaseError as e:
        logger.error(f"Database connection error: {e}")
        raise

def read_json_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from file {file_path}: {e}")
        return {}

def get_stock_data(connection, stock_name):
    cursor = connection.cursor()
    one_year_ago = datetime.now() - timedelta(days=365)
    query = """
        SELECT record_date, stock_code, name, stock_type, closing_price, opening_price, high_price, low_price
        FROM STOCK 
        WHERE name = :name
        AND record_date >= :start_date
        ORDER BY record_date
    """
    cursor.execute(query, name=stock_name, start_date=one_year_ago)
    columns = ['record_date', 'stock_code', 'name', 'stock_type', 'closing_price', 'opening_price', 'high_price', 'low_price']
    data = cursor.fetchall()
    return pd.DataFrame(data, columns=columns)

def predict_future(model, scaler, last_sequence, days):
    current_sequence = last_sequence
    predictions = []
    for _ in range(days):
        current_sequence_scaled = scaler.transform(current_sequence)
        current_sequence_reshaped = current_sequence_scaled.reshape((1, current_sequence_scaled.shape[0], current_sequence_scaled.shape[1]))
        prediction = model.predict(current_sequence_reshaped)
        
        pred_scaled = np.zeros((1, len(FEATURES)))
        pred_scaled[0, :] = current_sequence_scaled[-1, :]
        pred_scaled[0, 0] = prediction[0, 0]
        pred_return = scaler.inverse_transform(pred_scaled)[0, 0]
        
        predictions.append({
            'predicted_return': pred_return,
            'predicted_movement': 'Up' if pred_return > current_sequence[-1, 0] else 'Down'
        })
        
        new_data_point = current_sequence[-1].copy()
        new_data_point[0] = pred_return
        current_sequence = np.vstack((current_sequence[1:], new_data_point.reshape(1, -1)))
    
    return predictions

@app.route('/budongsanAllData', methods=['GET'])
def get_budongsan_all_data():
    data = read_json_data(json_file_path_all_data)
    return jsonify(data)

@app.route('/budongsanMapData', methods=['GET'])
def get_budongsan_map_data():
    data = read_json_data(json_file_path_map_data)
    return jsonify(data)

@app.route('/schoolData', methods=['GET'])
def get_school_data():
    data = read_json_data(json_file_path_school_data)
    return jsonify(data)

@app.route('/storeData', methods=['GET'])
def get_store_data():
    data = read_json_data(json_file_path_store_data)
    return jsonify(data)

@app.route('/busStationData', methods=['GET'])
def get_bus_station_data():
    data = read_json_data(json_file_path_busStation_data)
    return jsonify(data)

@app.route('/add-property', methods=['POST'])
def add_property():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                check_query = """
                SELECT COUNT(*) FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(check_query, user_num=user_num, property_num=property_num)
                count = cursor.fetchone()[0]
                
                if count > 0:
                    return jsonify({'status': 'error', 'message': 'Duplicate entry'}), 400
                
                insert_query = """
                INSERT INTO PROPERTY_FAVORITE (budongsan_id, user_num, property_num)
                VALUES (property_favorite_seq.NEXTVAL, :user_num, :property_num)
                """
                cursor.execute(insert_query, user_num=user_num, property_num=property_num)
                connection.commit()
                logger.info("Data inserted successfully.")
        
        return jsonify({'status': 'success', 'message': 'Property number added'})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/delete-property', methods=['POST'])
def delete_property():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                delete_query = """
                DELETE FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(delete_query, user_num=user_num, property_num=property_num)
                connection.commit()
                logger.info("Data deleted successfully.")
        
        return jsonify({'status': 'success', 'message': 'Property number deleted'})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/check-property', methods=['POST'])
def check_property():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                check_query = """
                SELECT COUNT(*) FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(check_query, user_num=user_num, property_num=property_num)
                count = cursor.fetchone()[0]
                
                return jsonify({'isFavorite': count > 0})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/get-favorite-properties', methods=['POST'])
def get_favorite_properties():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        user_num = data['user_num']

        if isinstance(user_num, dict) and 'userNum' in user_num:
            user_num = user_num['userNum']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                select_query = """
                SELECT p.property_num, p.address, p.apartMent_Name, p.transaction_Amount
                FROM PROPERTY_FAVORITE pf
                JOIN PROPERTY p ON pf.property_num = p.property_num, p.year_Built, p.floor_Number, p.year_Built, p.registration_Date
                WHERE pf.user_num = :user_num
                """
                
                cursor.execute(select_query, (user_num,))
                properties = cursor.fetchall()
                
                properties_list = [
                    {
                        'property_num': row[0],
                        'address': row[1],
                        'apartMentName': row[2],
                        'transactionAmount': row[3],
                        'yearBuilt': row[4],
                        'floorNumber': row[5]
                    }
                    for row in properties
                ]
                
                return jsonify({'status': 'success', 'properties': properties_list})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/analyze', methods=['POST', 'GET'])
def analyze_stock():
    logger.info(f"Received request: {request.method} {request.url}")
    logger.info(f"Request data: {request.json}")
    
    if request.method == 'POST':
        try:
            data = request.json
            logger.info(f"Received data: {data}")
            name = data['stockName']
            start_date = datetime.strptime(data['startDate'], '%Y-%m-%d')
            end_date = datetime.strptime(data['endDate'], '%Y-%m-%d')
            
            connection = get_db_connection()
            if connection is None:
                return jsonify({'error': '데이터베이스 연결 실패'}), 500

            df = get_stock_data(connection, name)
            
            if df.empty:
                return jsonify({'error': f'{name} 주식의 데이터가 부족합니다.'}), 400

            df = preprocess_data(df)
            df = add_technical_indicators(df)

            target = 'closing_price'

            (X_train, X_test, y_train, y_test), scaler = prepare_data_for_lstm(df, FEATURES, target)
            model, history = train_lstm_model(X_train, y_train)
            loss, mae = evaluate_lstm_model(model, X_test, y_test)

            logger.info(f"Model trained. Test MAE: {mae:.4f}")

            last_sequence = df[FEATURES].values[-10:]
            
            days_to_predict = (end_date - start_date).days + 1
            predictions = predict_future(model, scaler, last_sequence, days_to_predict)
            result_data = [
                {
                    'date': (start_date + timedelta(days=i)).strftime('%Y-%m-%d'),
                    'predicted_return': round(pred['predicted_return'] * 100, 2),
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

if __name__ == "__main__":
    app.run(debug=True)