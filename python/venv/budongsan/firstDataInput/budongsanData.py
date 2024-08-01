import requests
import datetime
import pandas as pd
import os
import time

my_key = 'L0t9uXTMO4+pUywKIqxTSahcicSVsUvVJ97KilcZpUGa+Ovpg/jo5jEAJ7PKk8tfi9tKmDBXjShi719/ZNGQlg=='
url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
params = {
    'serviceKey'  : my_key
    , 'pageNo'    : '1'
    , 'numOfRows' : '10'
    , 'LAWD_CD'   : '41450'
    , 'DEAL_YMD'  : '202406'
}
response = requests.get(url, params=params)
print(response.text[:1000])

from bs4 import BeautifulSoup as BS
soup = BS(response.text, 'xml')
item = soup.find('item')
print(item)

code_file = "법정동코드 전체자료/법정동코드 전체자료.txt"
code = pd.read_csv(code_file, sep='\t')
code

code.columns = ['code', 'name', 'is_exist']
code = code [code['is_exist'] == '존재']
print(code['code'][0])
print(type(code['code'][0])) ## int64타입

## string으로 변경
code['code'] = code['code'].apply(str) 
code

year = [str("%02d" %(y)) for y in range(2024, 2025)]
month = [str("%02d" %(m)) for m in range(7, 8)]
base_date_list = ["%s%s" %(y, m) for y in year for m in month ]

gu_list = list(input().split())
gu_code_list = []

# gu_code_list에 gu 이름과 코드를 함께 저장

for gu in gu_list:
    gu_code = code[(code['name'].str.contains(gu))]
    gu_code = gu_code[['code', 'name']].reset_index(drop=True)
    gu_code_code = str(gu_code['code'][0])[0:5]
    gu_code_name = gu_code['name'][0]
    gu_code_list.append((gu_code_code, gu_code_name))
print(gu_code_list)

import requests
from bs4 import BeautifulSoup as BS

data = []
pageNo = 1
while True:
    params = {
        'serviceKey': my_key,
        'pageNo': str(pageNo),
        'numOfRows': '10',
        'LAWD_CD': gu_code_code,
        'DEAL_YMD': base_date_list
    }
    
    response = requests.get(url, params=params)
    soup = BS(response.text, 'xml')
    
    # Break loop if no items found
    if len(soup.find_all('item')) == 0:
        break
    
    for item in soup.find_all('item'):
        record = []
        
        # Handle missing values by checking if the tag exists
        거래금액 = item.find('거래금액')
        record.append(거래금액.text if 거래금액 else 'null')
        
        건축년도 = item.find('건축년도')
        record.append(건축년도.text if 건축년도 else 'null')

        법정동 = item.find('법정동')
        지번 = item.find('지번')
        dong_jibun = f"{gu_code_name} {법정동.text if 법정동 else 'null'} {지번.text if 지번 else 'null'}"
        record.append(dong_jibun)

        년 = item.find('년')
        월 = item.find('월')
        일 = item.find('일')
        date = f"{년.text if 년 else 'null'}.{월.text if 월 else 'null'}.{일.text if 일 else 'null'}"
        record.append(date)
        
        도로명 = item.find('도로명')
        record.append(도로명.text if 도로명 else 'null')
        
        아파트 = item.find('아파트')
        record.append(아파트.text if 아파트 else 'null')
        
        전용면적 = item.find('전용면적')
        record.append(전용면적.text if 전용면적 else 'null')
        
        층 = item.find('층')
        record.append(층.text if 층 else 'null')

        data.append(record)

    pageNo += 1

    import pandas as pd

# 이미 수집된 data 리스트가 있다고 가정합니다.
data = pd.DataFrame(data, columns=["가격", "건축년도", "주소", "등록일", "도로명", "아파트", "전용면적", "층"])

# 가격 열에서 공백 제거 및 쉼표 제거 후 정수형으로 변환
data['가격'] = data['가격'].str.strip().str.replace(',', '').astype(int)

# 날짜 열을 datetime 형식으로 변환
data['등록일'] = pd.to_datetime(data['등록일'], format='%Y.%m.%d')

# 전용면적 열을 실수형으로 변환
data['전용면적'] = data['전용면적'].astype(float)


print(len(data))
data

items = pd.DataFrame(data)
items.head()
items.to_csv(os.path.join("budongsanData.csv"), index=False,encoding="utf-8")