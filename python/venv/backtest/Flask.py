from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

# JSON 파일 경로 정의 (상대 경로)
json_file_path_all_data = os.path.join(os.path.dirname(__file__), 'allDataSelect\\budongsanAllData.txt')
json_file_path_map_data = os.path.join(os.path.dirname(__file__), 'mapDataSelect\\budongsanMapData.txt')

# 파일 경로를 출력하여 확인
print(f'경로: {json_file_path_all_data}')
print(f'경로: {json_file_path_map_data}')

# 파일에서 JSON 데이터를 읽는 함수
def read_json_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

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

if __name__ == "__main__":
    app.run(debug=True)
