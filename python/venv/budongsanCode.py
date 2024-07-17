import csv
import json
import os

# csv 파일 경로
csv_file_path = os.path.join(os.path.dirname(__file__), 'budongsanData.csv')

# csv 파일 읽어오기
with open(csv_file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    next(reader)  # 첫 줄 skip

    # 각 라인마다 딕셔너리 생성 후 리스트에 추가
    data = []
    for line in reader:
        d = {
            'transactionAmount': int(line[0]),
            'yearBuilt': line[1],
            'address': line[2],
            'registrationDate': line[3],
            'apartMentName': line[4],
            'squareFootage': line[5],
            'floorNumber': line[6]
        }
        data.append(d)

# json string으로 변환
json_string = json.dumps(data, ensure_ascii=False, indent=2)

# txt 파일로 저장할 경로
txt_file_path = 'budongsanData.txt'

# txt 파일 쓰기
with open(txt_file_path, 'w', encoding='utf-8') as f:
    f.write(json_string)