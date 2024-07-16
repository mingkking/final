import requests
import datetime
import pandas as pd
import os
import time
from bs4 import BeautifulSoup as BS

my_key = '38dr8zsyMxvTI5ZJm7T/djE+PwYMfQwFxLQLdPzYnPSWwViMa6qZRtzhbMbQibrhBSVC5UJTUwd91ppjPEpIKg=='
url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
params = {
    'serviceKey'  : my_key
    , 'pageNo'    : 1
    , 'numOfRows' : 10
    , 'LAWD_CD'   : '41450'
    , 'DEAL_YMD'  : '202406'
}
response = requests.get(url, params=params)

soup = BS(response.text, 'xml')
item = soup.find('item')

code_file = "법정동코드 전체자료/법정동코드 전체자료.txt"
code = pd.read_csv(code_file, sep='\t')

code.columns = ['code', 'name', 'is_exist']
code = code [code['is_exist'] == '존재']
print(code['code'][0])
print(type(code['code'][0])) ## int64타입

## string으로 변경
code['code'] = code['code'].apply(str) 

year = [str("%02d" %(y)) for y in range(2024, 2025)]
month = [str("%02d" %(m)) for m in range(7, 8)]
base_date_list = ["%s%s" %(y, m) for y in year for m in month ]

# 구 코드와 이름을 추출
code['gu_code'] = code['code'].apply(lambda x: x[:5])
code['gu_name'] = code['name'].apply(lambda x: ' '.join(x.split()[:2]))

# 중복 제거한 구 코드 리스트
gu_code_list = code['gu_code'].unique().tolist()


data = []
pageNo = 1
for gu_code in gu_code_list:
    pageNo = 1
    while True:
        params = {
            'serviceKey': my_key,
            'pageNo': str(pageNo),
            'numOfRows': '10',
            'LAWD_CD': gu_code,
            'DEAL_YMD': base_date_list
        }
        response = requests.get(url, params=params)
        soup = BS(response.text, 'xml')
        if len(soup.find_all('item')) == 0:
            break
        for item in soup.find_all('item'):
            record = []
            record.append(item.find('거래금액').text)
            record.append(item.find('건축년도').text)
    
            # Concatenate 법정동 and 지번 into one field
            dong_jibun = f"{item.find('법정동').text} {item.find('지번').text}"
            record.append(dong_jibun)
    
            # 연도, 월, 일을 합쳐서 하나의 문자열로 추가
            date = f"{item.find('년').text}.{item.find('월').text}.{item.find('일').text}"
            record.append(date)
            
            record.append(item.find('도로명').text)
            record.append(item.find('아파트').text)
            
            
            record.append(item.find('전용면적').text)
            record.append(item.find('층').text)

        
        

            data.append(record)

        pageNo += 1
        
    import pandas as pd

# data 변수가 이미 정의되어 있다고 가정
data = pd.DataFrame(data, columns=["가격", "건축년도", "주소", "등록일", "도로명", "아파트", "전용면적", "층"])

# 가격 열에서 공백 제거 및 쉼표 제거 후 정수형으로 변환
data['가격'] = data['가격'].str.strip().str.replace(',', '').astype(int)

# 날짜 열을 datetime 형식으로 변환
data['등록일'] = pd.to_datetime(data['등록일'], format='%Y.%m.%d')

# 전용면적 열을 실수형으로 변환
data['전용면적'] = data['전용면적'].astype(float)

items = pd.DataFrame(data) 
items.head()
items.to_csv(os.path.join("%s_%s~%s.csv" %(gu_code, year[0], year[-1])), index=False,encoding="utf-8")
items.to_excel('output_file_last_all.xlsx', index=False)