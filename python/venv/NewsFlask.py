
import os
import requests
from bs4 import BeautifulSoup
import oracledb
import joblib
from konlpy.tag import Okt
import datetime
from flask import Flask, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
CORS(app)

# Oracle 클라이언트 초기화
oracledb.init_oracle_client()

# 현재 파일이 있는 디렉토리에서 상대 경로로 모델 파일을 로드합니다
current_directory = os.path.dirname(__file__)
loaded_model_path = os.path.join(current_directory, 'news', 'ML_Model', 'rf_model.joblib')
loaded_vectorizer_path = os.path.join(current_directory, 'news', 'ML_Model', 'tfidf_vectorizer.joblib')

# ML 모델 가져오기
loaded_model = joblib.load(loaded_model_path)
loaded_vectorizer = joblib.load(loaded_vectorizer_path)
okt = Okt()


# 데이터 베이스 연결 하는 함수
def get_db_connection():
    try:
        connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
        #connection = oracledb.connect(user="investigate", password="team1", dsn="13.125.176.132:1521/XE") # 아마존 데이터베이스 이용시 변경
        logger.info("Database connection established successfully.")
        return connection
    except oracledb.DatabaseError as e:
        logger.error(f"Database connection error: {e}")
        raise
def preprocess_text(text):

    tokens = okt.morphs(text, stem=True)
    return ' '.join(tokens)

def crawl_url(url):
    titles, urls, dates, imgs = [], [], [], []
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
                selector3 = f"#container > div > div.allnews-wrap > div:nth-child({section}) > ul > li:nth-child({x}) > div > div.thumb > a > img"
                element1 = soup.select_one(selector1)
                element2 = soup.select_one(selector2)
                element3 = soup.select_one(selector3)
                if element1 and element2:
                    title_text = element1.get_text()
                    link = element1['href']
                    date = element2.get_text().split()[0]
                    print(date)
                    if date == today:
                        titles.append(title_text)
                        urls.append(link)
                        dates.append(element2.get_text())
                        print(dates)

                        # 이미지가 없을 때 처리
                        if element3:
                            imglink = element3.get('src')
                        else:
                            imglink = None

                        imgs.append(imglink)

                        found_today = True
                    elif date < today:
                        return titles, urls, dates, imgs
        if not found_today:
            return titles, urls, dates, imgs
        pageNum += 1

def predict_categories(titles):
    if not titles:
        return []
    processed_titles = [preprocess_text(title) for title in titles]
    title_tfidf = loaded_vectorizer.transform(processed_titles)
    predicted_categories = loaded_model.predict(title_tfidf)
    return predicted_categories.tolist()

def check_existing_titles(cursor, titles):
    placeholders = ','.join([':' + str(i+1) for i in range(len(titles))])
    query = f"SELECT title FROM news WHERE title IN ({placeholders})"
    cursor.execute(query, titles)
    existing_titles = set(row[0] for row in cursor.fetchall())
    return existing_titles

def insert_data(cursor, titles, urls, dates, categories, imgs):
    if not titles:
        print("삽입할 데이터가 없습니다.")
        return
    existing_titles = check_existing_titles(cursor, titles)
    new_data = [(title, url, date, category, img)
                for title, url, date, category, img in zip(titles, urls, dates, categories, imgs)
                if title not in existing_titles]
    if not new_data:
        print("새로 삽입할 데이터가 없습니다.")
        return
    sql = """
    INSERT INTO news (title, url, published_at, category, imgs)
    VALUES (:1, :2, :3, :4, :5)
    """
    cursor.executemany(sql, new_data)
    print(f"{len(new_data)}개의 새로운 기사가 삽입되었습니다.")

@app.route('/news/update_news', methods=['POST'])
def update_news():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        urls = [
            "https://www.hankyung.com/all-news-finance?page=",
            "https://www.hankyung.com/all-news-economy?page=",
            "https://www.hankyung.com/all-news-realestate?page="
        ]

        for url in urls:
            titles, article_urls, dates, imgs = crawl_url(url)
            if titles:
                predicted_categories = predict_categories(titles)
                insert_data(cursor, titles, article_urls, dates, predicted_categories, imgs)
                print(f"{url} 크롤링 및 데이터 처리 완료")
            else:
                print(f"{url}에서 오늘 날짜의 기사를 찾지 못했습니다.")

        conn.commit()
        print("크롤링 및 ML 후 데이터 입력 완료")
        cursor.close()
        conn.close()
        return jsonify({"message": "뉴스 업데이트 완료"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def convert_lob(value):
    if value is None:
        return ""
    try:
        # CLOB 데이터를 문자열로 변환
        if isinstance(value, oracledb.LOB):
            return value.read().decode('utf-8')
        return str(value)
    except Exception as e:
        logger.warning(f"Error converting LOB data: {e}")
        return ""

@app.route('/news/economicNewsFeed', methods=['POST'])
def get_economic_news_feed():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 최신 뉴스 4개만 가져오는 쿼리, URL과 이미지가 NULL이 아닌 경우만 포함
        query = """
        SELECT title, url, published_at, category, imgs
        FROM (
            SELECT title, url, published_at, category, imgs
            FROM news
            WHERE category = '증권'
              AND url IS NOT NULL
              AND imgs IS NOT NULL
            ORDER BY published_at DESC
        )
        WHERE ROWNUM <= 4
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        news_items = []
        for row in rows:
            news_item = {
                "title": convert_lob(row[0]),
                "url": convert_lob(row[1]),
                "date": convert_lob(row[2]),
                "category": convert_lob(row[3]),
                "img": convert_lob(row[4])  # 필요 시 이미지 데이터 처리
            }
            news_items.append(news_item)

        cursor.close()
        conn.close()

        logger.info(f"News items: {news_items}")  # 디버깅을 위한 로깅
        return jsonify({"news": news_items}), 200
    except Exception as e:
        logger.exception("An error occurred while fetching news")
        return jsonify({"error": str(e)}), 500

    
if __name__ == '__main__':
    app.run(debug=True)
