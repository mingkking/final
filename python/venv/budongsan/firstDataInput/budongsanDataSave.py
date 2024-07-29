import oracledb
import csv
import os

oracledb.init_oracle_client()
con = oracledb.connect(user="scott", password="tiger", dsn="localhost:1521")

print('연결성공')


cursor = con.cursor()

sql = '''
    INSERT INTO property (
        transaction_amount, year_built, address, registration_date, road_name, apartment_name, square_footage, floor_number
    )
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5, :6, :7, :8)
'''

try:
    # 상대경로로 CSV 파일 열기
    csv_file_path = os.path.join(os.path.dirname(__file__),'budongsanData.csv')
    print(csv_file_path)
    with open(csv_file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        
        # 첫 줄이 헤더일 경우 건너뛰기
        next(reader)
        
        # 데이터 삽입
        for row in reader:
            # 데이터가 8개 항목을 포함하는지 확인
            if len(row) == 8:
                # transaction_amount에 '0000' 추가
                transaction_amount = row[0] + '0000'

                # year_built에서 연도만 추출
                year_built = int(row[1][:4])
                # row[1] 값을 year_built로 대체
                row[0] = transaction_amount
                row[1] = year_built
                
                # SQL 실행
                cursor.execute(sql, row)
            else:
                print(f"행 오류: {row}")

    # 커밋
    con.commit()

except Exception as e:
    print("오류 발생:", e)

finally:
    # 연결 닫기
    con.close()
