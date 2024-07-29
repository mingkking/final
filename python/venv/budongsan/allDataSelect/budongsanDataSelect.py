import oracledb
import csv
import os

oracledb.init_oracle_client()
con = oracledb.connect(user="scott", password="tiger", dsn="localhost:1521")

print('연결성공')

cursor = con.cursor()

sql = '''
    SELECT PROPERTY_NUM,
        TRANSACTION_AMOUNT,
        YEAR_BUILT,
        ADDRESS,
        TO_CHAR(REGISTRATION_DATE, 'YYYY-MM-DD') AS REGISTRATION_DATE,
        ROAD_NAME,
        APARTMENT_NAME,
        SQUARE_FOOTAGE,
        FLOOR_NUMBER
    FROM property
'''

# 쿼리 실행
cursor.execute(sql)

# 데이터 가져오기
rows = cursor.fetchall()

# CSV 파일로 저장
with open(os.path.join(os.path.dirname(__file__), 'budongsanAllData.csv'), 'w', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    # 컬럼 이름 가져오기 (테이블의 컬럼 이름을 첫 번째 행으로 추가)
    col_names = [desc[0] for desc in cursor.description]
    csvwriter.writerow(col_names)
    # 데이터 쓰기
    csvwriter.writerows(rows)

print('데이터를 budonsangAllData.csv 파일에 저장했습니다.')

# 연결 종료
cursor.close()
con.close()