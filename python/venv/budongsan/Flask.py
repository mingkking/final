from flask import Flask, jsonify
import json

app = Flask(__name__)

# Define the paths to the JSON files
json_file_path_all_data = './allDataSelect/budongsanAllData.txt'
json_file_path_map_data = './mapDataSelect/budongsanMapData.txt'

# Function to read JSON data from file
def read_json_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

# Route to serve the JSON data for all data
@app.route('/budongsanAllData', methods=['GET'])
def get_budongsan_all_data():
    data = read_json_data(json_file_path_all_data)
    return jsonify(data)

# Route to serve the JSON data for map data
@app.route('/budongsanMapData', methods=['GET'])
def get_budongsan_map_data():
    data = read_json_data(json_file_path_map_data)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
