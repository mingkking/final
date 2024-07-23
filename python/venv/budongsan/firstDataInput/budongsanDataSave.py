import oracledb
import csv

oracledb.init_oracle_client()
con = oracledb.connect(user="scott", password="tiger", dsn="localhost:1521")

print('연결성공')

cursor = con.cursor()

sql = '''
    INSERT INTO property (
        transaction_amount, year_built, address, registration_date, road_name, apartment_name, square_footage, floor_number
    )
    VALUES (:1,:2 , :3, TO_DATE(:3, 'YYYY-MM-DD'), :5, :6, :7, :8)
'''

try:
    # CSV 파일 열기
    with open('c:\\fProject\\final\\python\\venv\\budongsan\\firstDataInput\\budongsanData.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        
        # 첫 줄이 헤더일 경우 건너뛰기
        next(reader)
        
        # 데이터 삽입
        for row in reader:
            # 데이터가 8개 항목을 포함하는지 확인
            if len(row) == 8:
                 # year_built에서 연도만 추출
                year_built = int(row[1][:4])
                # row[1] 값을 year_built로 대체
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
