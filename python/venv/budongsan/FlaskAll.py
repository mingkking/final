from flask import Flask, jsonify
import os
import json

app = Flask(__name__)

# Define the path to the JSON file
json_file_path = 'budongsanAllData.txt'

# Function to read JSON data from file
def read_json_data():
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

# Route to serve the JSON data
@app.route('/budongsanAllData', methods=['GET'])
def get_budongsan_data():
    data = read_json_data()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
