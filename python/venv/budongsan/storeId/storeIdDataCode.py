import pandas as pd
import json
import os

# 여러 CSV 파일 경로
cities = ['강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '세종', '울산', '인천', '전남', '전북', '제주', '충남', '충북']  # 도시 목록
csv_dir = os.path.join(os.path.dirname(__file__), 'storeIdData')
csv_files = [os.path.join(csv_dir, f'{city}_202403.csv') for city in cities]

# 모든 CSV 파일을 읽어 하나의 DataFrame에 결합
all_data = pd.DataFrame()

for file in csv_files:
    if os.path.exists(file):
        df = pd.read_csv(file, encoding='utf-8')
        all_data = pd.concat([all_data, df], ignore_index=True)

# 필요한 컬럼만 선택
store = all_data[['상호명', '상권업종소분류명', '지번주소', '위도', '경도']]

# '편의점' 데이터만 필터링
convenience_store = store[store['상권업종소분류명'] == '편의점']

# DataFrame을 JSON 형식으로 변환
json_data = convenience_store.to_dict(orient='records')

# TXT 파일로 저장할 경로
txt_file_path = 'storeIdData.txt'

# JSON 형식으로 저장
with open(txt_file_path, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, ensure_ascii=False, indent=4)

