import pandas as pd
import json
import os

# CSV 파일 경로
csv_file_path = os.path.join(os.path.dirname(__file__), 'schoolData.csv')

# CSV 파일 읽기
df = pd.read_csv(csv_file_path, encoding='utf-8')

# 필요한 컬럼만 선택
school = df[['학교명', '학교급구분', '소재지지번주소', '위도', '경도']]

# DataFrame을 JSON 형식으로 변환
json_data = school.to_dict(orient='records')

# TXT 파일로 저장할 경로
txt_file_path = 'schoolData.txt'

# JSON 형식으로 저장
with open(txt_file_path, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, ensure_ascii=False, indent=4)
