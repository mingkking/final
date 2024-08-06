import requests
from bs4 import BeautifulSoup
import oracledb



# url 설정
url = "https://www.hankyung.com/all-news-economy?page="

# 빈 배열 생성
titles = []
urls = []
dates = []


# 페이지 수 설정
for pageNum in range(1, 601):
    response = requests.get(f"{url}{pageNum}")
    soup = BeautifulSoup(response.text, 'html.parser')

    # 한 페이지에 섹션이 5개인데 3번이 없어서 3번은 continue
    for section in range(1, 6):
        if section == 3:
            continue
        # 한 섹션에 10개의 기사가 있음
        for x in range(1, 11):
            selector1 = f"#container > div > div.allnews-wrap > div:nth-child({section}) > ul > li:nth-child({x}) > div > div.txt-cont > h2 > a"
            selector2 = f"#container > div > div.allnews-wrap > div:nth-child({section}) > ul > li:nth-child({x}) > div > div.txt-cont > p"
            element1 = soup.select_one(selector1)
            element2 = soup.select_one(selector2)
            title_text = element1.get_text()
            link = element1['href']
            date = element2.get_text().split()[0].replace('.', '')  # 수정된 부분
            titles.append(title_text)
            urls.append(link)
            dates.append(date)

# 결과 출력
# print("titles:", titles)
# print("urls:", urls)
# print("dates:", dates)

oracledb.init_oracle_client(lib_dir=r"C:\Users\ict03_020\Oracle\instantclient_19.24\instantclient_19_24")

# 데이터베이스 연결 정보
dsn = oracledb.makedsn("192.168.0.39", "1521", service_name="XE")

try:
    conn = oracledb.connect(
        user="investigate",
        password="team1",
        dsn=dsn
    )
    print("Database connection successful!")
except oracledb.DatabaseError as e:
    print("Database connection error:", e)

cursor = conn.cursor()

sql = """
INSERT INTO news (title, url, published_at, category)
VALUES (:1, :2, :3, :4)
"""

# 크롤링 데이터 sql문장에 삽입
for title, url, date in zip(titles, urls, dates):
    cursor.execute(sql, (title, url, date, "경제"))

conn.commit()

print("데이터 완료")

cursor.close()
conn.close()
