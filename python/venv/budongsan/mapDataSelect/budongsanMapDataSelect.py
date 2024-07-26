import oracledb
import csv
import os

oracledb.init_oracle_client()
con = oracledb.connect(user="scott", password="tiger", dsn="localhost:1521")

print('연결성공')

cursor = con.cursor()

sql = '''
    WITH day_series AS (
    SELECT TRUNC(SYSDATE) - LEVEL + 1 AS day
    FROM dual
    CONNECT BY LEVEL <= 10
    ),
    weekdays AS (
        SELECT day
        FROM day_series
        WHERE TO_CHAR(day, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH') NOT IN ('SAT', 'SUN')
    )
    SELECT PROPERTY_NUM,
        TRANSACTION_AMOUNT,
        YEAR_BUILT,
        ADDRESS,
        TO_CHAR(REGISTRATION_DATE, 'YYYY-MM-DD') AS FORMATTED_REGISTRATION_DATE,
        ROAD_NAME,
        APARTMENT_NAME,
        SQUARE_FOOTAGE,
        FLOOR_NUMBER
    FROM property
    WHERE TRUNC(REGISTRATION_DATE) IN (
        SELECT day
        FROM (
            SELECT day
            FROM weekdays
            ORDER BY day DESC
        ) WHERE ROWNUM <= 3
    )
    ORDER BY FORMATTED_REGISTRATION_DATE DESC
'''

# 쿼리 실행
cursor.execute(sql)

# 데이터 가져오기
rows = cursor.fetchall()

# CSV 파일로 저장
with open(os.path.join(os.path.dirname(__file__), 'budongsanMapData.txt'), 'w', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    # 컬럼 이름 가져오기 (테이블의 컬럼 이름을 첫 번째 행으로 추가)
    col_names = [desc[0] for desc in cursor.description]
    csvwriter.writerow(col_names)
    # 데이터 쓰기
    csvwriter.writerows(rows)

print('데이터를 budongsanMapDataSelect.csv 파일에 저장했습니다.')

# 연결 종료
cursor.close()
con.close()