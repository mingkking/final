import os
import requests
from bs4 import BeautifulSoup
import oracledb
import joblib
from konlpy.tag import Okt
import datetime
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# 현재 작업 디렉토리 설정 (예: python 파일이 있는 디렉토리)
current_dir = os.path.dirname(__file__)

# 모델과 벡터라이저 파일 경로 설정
model_path = os.path.join(current_dir, 'news', 'ml_Model', 'rf_model.joblib')
vectorizer_path = os.path.join(current_dir, 'news', 'ml_Model', 'tfidf_vectorizer.joblib')

# ML 모델 가져오기
loaded_model = joblib.load(model_path)
loaded_vectorizer = joblib.load(vectorizer_path)

# 텍스트 전처리 함수
okt = Okt()

def preprocess_text(text):
    tokens = okt.morphs(text, stem=True)
    return ' '.join(tokens)

def crawl_url(url):
    titles = []
    urls = []
    dates = []
    today = datetime.date.today().strftime('%Y.%m.%d')

    pageNum = 1
    while True:
        response = requests.get(f"{url}{pageNum}")
        soup = BeautifulSoup(response.text, 'html.parser')

        found_today = False
        for section in range(1, 6):
            if section == 3:
                continue
            for x in range(1, 11):
                selector1 = f"#container > div > div.allnews-wrap > div:nth-child({section}) > ul > li:nth-child({x}) > div > div.txt-cont > h2 > a"
                selector2 = f"#container > div > div.allnews-wrap > div:nth-child({section}) > ul > li:nth-child({x}) > div > div.txt-cont > p"
                element1 = soup.select_one(selector1)
                element2 = soup.select_one(selector2)
                if element1 and element2:
                    title_text = element1.get_text()
                    link = element1['href']
                    date = element2.get_text().split()[0]
                    if date == today:
                        titles.append(title_text)
                        urls.append(link)
                        dates.append(date.replace('.', ''))
                        found_today = True
                    elif date < today:
                        return titles, urls, dates  # 오늘 날짜보다 이전 날짜를 만나면 크롤링 중단

        if not found_today:
            return titles, urls, dates  # 현재 페이지에서 오늘 날짜 기사를 찾지 못했다면 크롤링 중단

        pageNum += 1

def predict_categories(titles):
    if not titles:  # 제목 리스트가 비어있는 경우 처리
        return []
    processed_titles = [preprocess_text(title) for title in titles]
    title_tfidf = loaded_vectorizer.transform(processed_titles)
    predicted_categories = loaded_model.predict(title_tfidf)
    return predicted_categories.tolist()  # numpy array를 리스트로 변환

def check_existing_titles(cursor, titles):
    placeholders = ','.join([':' + str(i+1) for i in range(len(titles))])
    query = f"SELECT title FROM news WHERE title IN ({placeholders})"
    cursor.execute(query, titles)
    existing_titles = set(row[0] for row in cursor.fetchall())
    return existing_titles

def insert_data(cursor, titles, urls, dates, categories):
    if not titles:  # 데이터가 없는 경우 처리
        print("삽입할 데이터가 없습니다.")
        return

    # 기존 title 확인
    existing_titles = check_existing_titles(cursor, titles)

    # 새로운 데이터만 필터링
    new_data = [(title, url, date, category)
                for title, url, date, category in zip(titles, urls, dates, categories)
                if title not in existing_titles]

    if not new_data:
        print("새로 삽입할 데이터가 없습니다.")
        return

    sql = """
    INSERT INTO news (title, url, published_at, category)
    VALUES (:1, :2, :3, :4)
    """
    cursor.executemany(sql, new_data)
    print(f"{len(new_data)}개의 새로운 기사가 삽입되었습니다.")


@app.route('/news/update_news', methods=['POST'])
def update_news():
    try:
        # Oracle DB 연결 설정
        oracledb.init_oracle_client(lib_dir=r"C:\Users\ict03_020\Oracle\instantclient_19.24\instantclient_19_24")
        dsn = oracledb.makedsn("192.168.0.39", "1521", service_name="XE")

        conn = oracledb.connect(user="investigate", password="team1", dsn=dsn)
        print("데이터베이스 연결 성공")
        cursor = conn.cursor()

        # URL 목록
        urls = [
            "https://www.hankyung.com/all-news-finance?page=",
            "https://www.hankyung.com/all-news-economy?page=",
            "https://www.hankyung.com/all-news-realestate?page="
        ]

        for url in urls:
            titles, article_urls, dates = crawl_url(url)
            if titles:  # 크롤링된 데이터가 있는 경우에만 처리
                predicted_categories = predict_categories(titles)
                insert_data(cursor, titles, article_urls, dates, predicted_categories)
                print(f"{url} 크롤링 및 데이터 처리 완료")
            else:
                print(f"{url}에서 오늘 날짜의 기사를 찾지 못했습니다.")

        conn.commit()  # 변경사항 커밋
        print("크롤링 및 ML 후 데이터 입력 완료")

        cursor.close()
        conn.close()

        return jsonify({"message": "뉴스 업데이트 완료"}), 200  # 성공적으로 작업이 완료된 경우 응답 추가

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)