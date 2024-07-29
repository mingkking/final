from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # 모든 경로에 대해 CORS 허용

# JSON 파일 경로 정의 (상대 경로)
json_file_path_all_data = os.path.join(os.path.dirname(__file__), 'allDataSelect', 'budongsanAllData.txt')
json_file_path_map_data = os.path.join(os.path.dirname(__file__), 'mapDataSelect', 'budongsanMapData.txt')
json_file_path_school_data = os.path.join(os.path.dirname(__file__), 'schoolSelect', 'schoolData.txt')
json_file_path_store_data = os.path.join(os.path.dirname(__file__), 'storeId', 'storeIdData.txt')
json_file_path_busStation_data = os.path.join(os.path.dirname(__file__), 'busStation', 'busStationData.txt')

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
def get_busStation_data():
    data = read_json_data(json_file_path_busStation_data)
    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=True)
