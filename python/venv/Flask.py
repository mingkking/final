from flask import Flask, jsonify, request
from flask_cors import CORS
import oracledb
import json
import os

app = Flask(__name__)
CORS(app)  # 모든 경로에 대해 CORS 허용

# Oracle 클라이언트 초기화 (필요한 경우만 호출)
oracledb.init_oracle_client()

# 데이터베이스 연결
def get_db_connection():
    try:
        connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
        print("Database connection established.")
        return connection
    except oracledb.DatabaseError as e:
        print("Database connection error:", e)
        raise

# JSON 파일 경로 정의 (상대 경로)
json_file_path_all_data = os.path.join(os.path.dirname(__file__), 'budongsan','allDataSelect', 'budongsanAllData.txt')
json_file_path_map_data = os.path.join(os.path.dirname(__file__), 'budongsan','mapDataSelect', 'budongsanMapData.txt')
json_file_path_school_data = os.path.join(os.path.dirname(__file__), 'budongsan','schoolSelect', 'schoolData.txt')
json_file_path_store_data = os.path.join(os.path.dirname(__file__), 'budongsan','storeId', 'storeIdData.txt')
json_file_path_busStation_data = os.path.join(os.path.dirname(__file__), 'budongsan','busStation', 'busStationData.txt')

print(json_file_path_all_data)

# 파일에서 JSON 데이터를 읽는 함수
def read_json_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from file {file_path}: {e}")
        return {}

# 모든 데이터를 제공하는 경로
@app.route('/budongsanAllData', methods=['GET'])
def get_budongsan_all_data():
    data = read_json_data(json_file_path_all_data)
    return jsonify(data)

# 지도 데이터를 제공하는 경로
@app.route('/budongsanMapData', methods=['GET'])
def get_budongsan_map_data():
    data = read_json_data(json_file_path_map_data)
    return jsonify(data)

# 학교 데이터를 제공하는 경로
@app.route('/schoolData', methods=['GET'])
def get_school_data():
    data = read_json_data(json_file_path_school_data)
    return jsonify(data)

# 편의점 데이터를 제공하는 경로
@app.route('/storeData', methods=['GET'])
def get_store_data():
    data = read_json_data(json_file_path_store_data)
    return jsonify(data)

# 버스 정류장 데이터를 제공하는 경로
@app.route('/busStationData', methods=['GET'])
def get_bus_station_data():
    data = read_json_data(json_file_path_busStation_data)
    return jsonify(data)

@app.route('/add-property', methods=['POST'])
def add_property():
    try:
        data = request.get_json()  # 클라이언트로부터의 JSON 데이터 수신
        print('Received data:', data)  # 로그 추가
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            print('Invalid data:', data)  # 로그 추가
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']  # 데이터에서 property_num 추출
        user_num = data['user_num']  # 데이터에서 user_num 추출

        # 중복 체크
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
                
                # 데이터 삽입 쿼리
                insert_query = """
                INSERT INTO PROPERTY_FAVORITE (budongsan_id, user_num, property_num)
                VALUES (property_favorite_seq.NEXTVAL, :user_num, :property_num)
                """
                cursor.execute(insert_query, user_num=user_num, property_num=property_num)
                connection.commit()
                print("Data inserted successfully.")
        
        # 응답 데이터 생성
        response = {
            'status': 'success',
            'message': 'Property number added'
        }
        return jsonify(response)
    except oracledb.DatabaseError as db_error:
        print(f"Database error: {db_error}")
        return jsonify({'status': 'error', 'message': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/delete-property', methods=['POST'])
def delete_property():
    try:
        data = request.get_json()  # 클라이언트로부터의 JSON 데이터 수신
        print('Received data:', data)  # 로그 추가
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            print('Invalid data:', data)  # 로그 추가
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']  # 데이터에서 property_num 추출
        user_num = data['user_num']  # 데이터에서 user_num 추출

        # 데이터 삭제
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                delete_query = """
                DELETE FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(delete_query, user_num=user_num, property_num=property_num)
                connection.commit()
                print("Data deleted successfully.")
        
        # 응답 데이터 생성
        response = {
            'status': 'success',
            'message': 'Property number deleted'
        }
        return jsonify(response)
    except oracledb.DatabaseError as db_error:
        print(f"Database error: {db_error}")
        return jsonify({'status': 'error', 'message': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500
    

# 데이터베이스 관심등록된 매물 이미지 유지
@app.route('/check-property', methods=['POST'])
def check_property():
    try:
        data = request.get_json()  # 클라이언트로부터의 JSON 데이터 수신
        print('Received data:', data)  # 로그 추가
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            print('Invalid data:', data)  # 로그 추가
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']  # 데이터에서 property_num 추출
        user_num = data['user_num']  # 데이터에서 user_num 추출

        # 데이터베이스에 연결
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                check_query = """
                SELECT COUNT(*) FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(check_query, user_num=user_num, property_num=property_num)
                count = cursor.fetchone()[0]
                
                # 관심 등록 여부에 따라 응답 생성
                response = {
                    'isFavorite': count > 0
                }
                return jsonify(response)
    except oracledb.DatabaseError as db_error:
        print(f"Database error: {db_error}")
        return jsonify({'status': 'error', 'message': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500


# 관심매물 마이페이지에 출력
@app.route('/get-favorite-properties', methods=['POST'])
def get_favorite_properties():
    try:
        data = request.get_json()  # 클라이언트로부터의 JSON 데이터 수신
        print('Received data:', data)  # 로그 추가
        
        if not data or 'user_num' not in data:
            print('Invalid data:', data)  # 로그 추가
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        user_num = data['user_num']  # 데이터에서 user_num 추출

        if isinstance(user_num, dict) and 'userNum' in user_num:
            user_num = user_num['userNum']

        # 데이터베이스에 연결
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # 사용자가 관심 등록한 매물 정보를 조회하는 쿼리
                select_query = """
                SELECT p.property_num, p.address, p.apartMent_Name, p.transaction_Amount, p.year_Built, p.floor_Number
                FROM PROPERTY_FAVORITE pf
                JOIN PROPERTY p ON pf.property_num = p.property_num
                WHERE pf.user_num = :user_num
                """
                
                # 튜플로 바인딩 변수 전달
                cursor.execute(select_query, (user_num,))
                properties = cursor.fetchall()
                
                # 조회 결과를 JSON 형태로 변환
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
                
                response = {
                    'status': 'success',
                    'properties': properties_list
                }
                return jsonify(response)
    except oracledb.DatabaseError as db_error:
        print(f"Database error: {db_error}")
        return jsonify({'status': 'error', 'message': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500





if __name__ == "__main__":
    app.run(debug=True)
