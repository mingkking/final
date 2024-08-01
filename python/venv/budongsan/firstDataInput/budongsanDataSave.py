import oracledb
import csv
import os

# Oracle 클라이언트 초기화 (필요한 경우만 호출)
oracledb.init_oracle_client()

# 데이터베이스 연결
try:
    print('Connecting to the database...')
    con = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
    print('Connection successful')
except oracledb.DatabaseError as e:
    print("Database connection error:", e)
    raise

cursor = con.cursor()

# SQL 구문 정의
sql = '''
    INSERT INTO property (
        transaction_amount, year_built, address, registration_date, road_name, apartment_name, square_footage, floor_number
    )
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5, :6, :7, :8)
'''

try:
    # 상대 경로로 CSV 파일 열기
    csv_file_path = os.path.join(os.path.dirname(__file__), 'budongsanData.csv')
    print("CSV 파일 경로:", csv_file_path)
    
    with open(csv_file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        
        # 첫 줄이 헤더일 경우 건너뛰기
        next(reader)
        
        # 데이터 삽입
        for row in reader:
            if len(row) == 8:
                try:
                    # transaction_amount에 '0000' 추가
                    transaction_amount = row[0] + '0000'
                    
                    # year_built에서 연도만 추출
                    year_built = int(row[1][:4])
                    
                    # 값 수정
                    row[0] = transaction_amount
                    row[1] = year_built
                    
                    # SQL 실행
                    cursor.execute(sql, row)
                except Exception as e:
                    print(f"행 오류: {row}, 오류: {e}")
            else:
                print(f"행 오류: {row}")

    # 커밋
    con.commit()

except Exception as e:
    print("데이터 처리 중 오류 발생:", e)

finally:
    # 커서 및 연결 닫기
    cursor.close()
    con.close()
