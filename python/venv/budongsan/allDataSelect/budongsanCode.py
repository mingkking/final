import csv
import json
import os

# csv 파일 경로
csv_file_path = os.path.join(os.path.dirname(__file__), 'budongsanAllData.csv')

# csv 파일 읽어오기
with open(csv_file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    next(reader)  # 첫 줄 skip

    # 각 라인마다 딕셔너리 생성 후 리스트에 추가
    data = []
    for line in reader:
        if not line:  # 빈 줄인 경우
            continue
        d = {
            'property_num': line[0],
            'transactionAmount': int(line[1]),
            'yearBuilt': line[2],
            'address': line[3],
            'registrationDate': line[4],
            'road_name' : line[5],
            'apartMentName': line[6],
            'squareFootage': line[7],
            'floorNumber': line[8]
        }
        data.append(d)
# json string으로 변환
json_string = json.dumps(data, ensure_ascii=False, indent=2)

# txt 파일로 저장할 경로
txt_file_path = 'budongsanAllData.txt'

# txt 파일 쓰기
with open(txt_file_path, 'w', encoding='utf-8') as f:
    f.write(json_string)