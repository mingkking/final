from flask import Flask, jsonify, request
from flask_cors import CORS
import oracledb
import json
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from backtest.technical_indicators.indicators import add_technical_indicators
from backtest.data_processing.data_processor import preprocess_data
from backtest.models.lstm_model import prepare_data_for_lstm, train_lstm_model, evaluate_lstm_model, build_lstm_model, predict_future, apply_rebalancing, analyze_stock
import logging
from datetime import datetime, timedelta


import joblib
from konlpy.tag import Okt
from bs4 import BeautifulSoup
import requests

# from stock.stock_interest import check_stock,delete_stock,add_stock
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Oracle 클라이언트 초기화
oracledb.init_oracle_client()

FEATURES = ['closing_price', 'SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']

# JSON 파일 경로 정의 (상대 경로)
json_file_path_all_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'allDataSelect', 'budongsanAllData.txt')
json_file_path_map_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'mapDataSelect', 'budongsanMapData.txt')
json_file_path_school_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'schoolSelect', 'schoolData.txt')
json_file_path_store_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'storeId', 'storeIdData.txt')
json_file_path_busStation_data = os.path.join(os.path.dirname(__file__), 'budongsan', 'busStation', 'busStationData.txt')


loaded_model_path = os.path.join(os.path.dirname(__file__), 'news', 'ML_Model', 'rf_model.joblib')
loaded_vectorizer_path = os.path.join(os.path.dirname(__file__), 'news', 'ML_Model', 'tfidf_vectorizer.joblib')

# 뉴스 ML 모델 가져오기
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
    today = datetime.today().strftime('%Y.%m.%d')
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

@app.route('/flask/news/update_news', methods=['POST'])
def update_news():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        logger.info("Connected to database.")
        
        urls = [
            "https://www.hankyung.com/all-news-finance?page=",
            "https://www.hankyung.com/all-news-economy?page=",
            "https://www.hankyung.com/all-news-realestate?page="
        ]

        for url in urls:
            logger.info(f"Crawling URL: {url}")
            titles, article_urls, dates, imgs = crawl_url(url)
            logger.info(f"Titles: {titles}")
            if titles:
                predicted_categories = predict_categories(titles)
                logger.info(f"Predicted categories: {predicted_categories}")
                insert_data(cursor, titles, article_urls, dates, predicted_categories, imgs)
                logger.info(f"{url} 크롤링 및 데이터 처리 완료")
            else:
                logger.info(f"{url}에서 오늘 날짜의 기사를 찾지 못했습니다.")

        conn.commit()
        logger.info("크롤링 및 ML 후 데이터 입력 완료")
        cursor.close()
        conn.close()
        return jsonify({"message": "뉴스 업데이트 완료"}), 200
    except Exception as e:
        logger.exception("An error occurred while updating news")
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

@app.route('/flask/news/economicNewsFeed', methods=['POST'])
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
        WHERE ROWNUM <= 6
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
    

@app.route('/flask/news/budongsanNews', methods=['POST'])
def get_budongsan_news_feed():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 최신 뉴스 4개만 가져오는 쿼리, URL과 이미지가 NULL이 아닌 경우만 포함
        query = """
        SELECT title, url, published_at, category, imgs
        FROM (
            SELECT title, url, published_at, category, imgs
            FROM news
            WHERE category = '부동산'
              AND url IS NOT NULL
              AND imgs IS NOT NULL
            ORDER BY published_at DESC
        )
        WHERE ROWNUM <= 6
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

@app.route('/flask/news/moneyNews', methods=['POST'])
def get_money_news_feed():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 최신 뉴스 4개만 가져오는 쿼리, URL과 이미지가 NULL이 아닌 경우만 포함
        query = """
        SELECT title, url, published_at, category, imgs
        FROM (
            SELECT title, url, published_at, category, imgs
            FROM news
            WHERE category = '경제'
              AND url IS NOT NULL
              AND imgs IS NOT NULL
            ORDER BY published_at DESC
        )
        WHERE ROWNUM <= 6
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


# 제이슨 파일 데이터에 필요한 함수
def read_json_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from file {file_path}: {e}")
        return {}
# 데이터 베이스에 있는 stock_info 에 있는 값들을 가져오는 함수 (1년치 데이터)
def get_stock_data(connection, stock_name):
    cursor = connection.cursor()
    one_year_ago = datetime.now() - timedelta(days=365)
    query = """
        SELECT record_date, stock_code, stock_name, stock_type, closing_price, opening_price, high_price, low_price
        FROM STOCK_INFO 
        WHERE stock_name = :stock_name
        AND record_date >= :start_date
        ORDER BY record_date
    """
    cursor.execute(query, stock_name=stock_name, start_date=one_year_ago)
    columns = ['record_date', 'stock_code', 'stock_name', 'stock_type', 'closing_price', 'opening_price', 'high_price', 'low_price']
    data = cursor.fetchall()
    return pd.DataFrame(data, columns=columns)

@app.route('/flask/budongsanAllData', methods=['GET'])
def get_budongsan_all_data():
    data = read_json_data(json_file_path_all_data)
    return jsonify(data)

@app.route('/flask/budongsanMapData', methods=['GET'])
def get_budongsan_map_data():
    data = read_json_data(json_file_path_map_data)
    return jsonify(data)

@app.route('/flask/schoolData', methods=['GET'])
def get_school_data():
    data = read_json_data(json_file_path_school_data)
    return jsonify(data)

@app.route('/flask/storeData', methods=['GET'])
def get_store_data():
    data = read_json_data(json_file_path_store_data)
    return jsonify(data)

@app.route('/flask/busStationData', methods=['GET'])
def get_bus_station_data():
    data = read_json_data(json_file_path_busStation_data)
    return jsonify(data)

@app.route('/flask/add-property', methods=['POST'])
def add_property():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                check_query = """
                SELECT COUNT(*) FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(check_query, user_num=user_num, property_num=property_num)
                count = cursor.fetchone()[0]
                
                if count > 0:
                    return jsonify({'status': 'error', 'message': 'Duplicate entry'}), 400
                
                insert_query = """
                INSERT INTO PROPERTY_FAVORITE (budongsan_id, user_num, property_num)
                VALUES (property_favorite_seq.NEXTVAL, :user_num, :property_num)
                """
                cursor.execute(insert_query, user_num=user_num, property_num=property_num)
                connection.commit()
                logger.info("Data inserted successfully.")
        
        return jsonify({'status': 'success', 'message': 'Property number added'})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/flask/delete-property', methods=['POST'])
def delete_property():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                delete_query = """
                DELETE FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(delete_query, user_num=user_num, property_num=property_num)
                connection.commit()
                logger.info("Data deleted successfully.")
        
        return jsonify({'status': 'success', 'message': 'Property number deleted'})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/flask/check-property', methods=['POST'])
def check_property():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'property_num' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        property_num = data['property_num']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                check_query = """
                SELECT COUNT(*) FROM PROPERTY_FAVORITE
                WHERE user_num = :user_num AND property_num = :property_num
                """
                cursor.execute(check_query, user_num=user_num, property_num=property_num)
                count = cursor.fetchone()[0]
                
                return jsonify({'isFavorite': count > 0})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

@app.route('/flask/get-favorite-properties', methods=['POST'])
def get_favorite_properties():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        user_num = data['user_num']

        if isinstance(user_num, dict) and 'userNum' in user_num:
            user_num = user_num['userNum']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                select_query = """
                SELECT p.property_num, p.transaction_Amount, p.year_Built, p.address, TO_CHAR(p.registration_Date, 'YYYY-MM-DD') as registrationDate, p.road_name, p.apartMent_Name, square_Footage, p.floor_Number
                FROM PROPERTY_FAVORITE pf
                JOIN PROPERTY p ON pf.property_num = p.property_num
                WHERE pf.user_num = :user_num
                """
                
                cursor.execute(select_query, (user_num,))
                properties = cursor.fetchall()
                
                properties_list = [
                    {
                        'property_num': row[0],
                        'transactionAmount': row[1],
                        'yearBuilt': row[2],
                        'address': row[3],
                        'registrationDate': row[4],
                        'roadName': row[5],
                        'apartMentName': row[6],
                        'squareFootage': row[7],
                        'floorNumber': row[8]
                    }
                    for row in properties
                ]
                
                return jsonify({'status': 'success', 'properties': properties_list})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500
    

@app.route('/flask/top-liked-properties', methods=['GET'])
def get_top_liked_properties():
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                query = """
                SELECT *
                FROM (
                    SELECT property_num, transaction_Amount, year_Built, address, TO_CHAR(registration_Date, 'YYYY-MM-DD') AS registrationDate, road_name, apartMent_Name, square_Footage, floor_Number
                    FROM (
                        SELECT p.property_num, p.transaction_Amount, p.year_Built, p.address, p.registration_Date, p.road_name, p.apartMent_Name, p.square_Footage, p.floor_Number,
                               COUNT(*) AS favorite_count
                        FROM PROPERTY_FAVORITE pf
                        JOIN PROPERTY p ON pf.property_num = p.property_num
                        GROUP BY p.property_num, p.transaction_Amount, p.year_Built, p.address, p.registration_Date, p.road_name, p.apartMent_Name, p.square_Footage, p.floor_Number
                        ORDER BY favorite_count DESC
                    )
                )
                WHERE ROWNUM <= 10
                """
                cursor.execute(query)
                properties = cursor.fetchall()
                
                properties_list = [
                    {
                        'property_num': row[0],
                        'transactionAmount': row[1],
                        'yearBuilt': row[2],
                        'address': row[3],
                        'registrationDate': row[4],
                        'roadName': row[5],
                        'apartMentName': row[6],
                        'squareFootage': row[7],
                        'floorNumber': row[8]
                    }
                    for row in properties
                ]
                
                return jsonify({'status': 'success', 'topProperties': properties_list})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500


 #관심 매물 확인
@app.route('/flask/check_stock', methods=['POST'])
def check_stock():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'stock_code' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        stock_code = data['stock_code']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                check_query = """
                SELECT CASE 
                    WHEN EXISTS (
                        SELECT 1
                        FROM INVESTIGATE.STOCK_INTEREST S
                        WHERE S.USER_NUM = :user_num AND S.STOCK_CODE = :stock_code
                    ) THEN 1
                    ELSE 0
                END AS is_favorite
                FROM DUAL
                """
                cursor.execute(check_query, user_num=user_num, stock_code=stock_code)
                count = cursor.fetchone()[0]
                
                return jsonify({'isFavorite': count > 0})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500
    
    
#해당 종목 관심등록
@app.route('/flask/add_stock', methods=['POST', 'GET'])
def add_stock():
    if request.method == 'GET':
        return jsonify({'status': 'error', 'message': 'GET method is not supported for this endpoint. Please use POST.'}), 405
    
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'stock_code' not in data or 'user_num' not in data or data['user_num'] is None:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': '유효하지 않은 데이터입니다. user_num과 stock_code가 필요합니다.'}), 400
        
        user_num = data['user_num']
        stock_code = data['stock_code']
        
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # 시퀀스에서 다음 값 가져오기
                cursor.execute("SELECT stock_interest_seq.NEXTVAL FROM dual")
                next_id = cursor.fetchone()[0]
                
                insert_query = """
                INSERT INTO STOCK_INTEREST (stock_interest_num, user_num, stock_code)
                VALUES (:stock_interest_num, :user_num, :stock_code)
                """
                logger.info(f"Executing query: {insert_query} with params: {{'stock_interest_num': next_id, 'user_num': user_num, 'stock_code': stock_code}}")
                cursor.execute(insert_query, stock_interest_num=next_id, user_num=user_num, stock_code=stock_code)
                connection.commit()
                logger.info("Data inserted successfully.")
        
        return jsonify({'status': 'success', 'message': '관심 종목에 추가되었습니다.'})
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'status': 'error', 'message': '서버 오류가 발생했습니다.'}), 500
    
#관심 등록 취소    
@app.route('/flask/delete_stock', methods=['POST','GET'])
def delete_stock():
    try:
        data = request.get_json()
        logger.info(f'Received data: {data}')
        
        if not data or 'stock_code' not in data or 'user_num' not in data:
            logger.warning(f'Invalid data: {data}')
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400
        
        stock_code = data['stock_code']
        user_num = data['user_num']

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                delete_query = """
                DELETE FROM STOCK_INTEREST
                WHERE user_num = :user_num AND stock_code = :stock_code
                """
                cursor.execute(delete_query, user_num=user_num, stock_code=stock_code)
                connection.commit()
                logger.info("Data deleted successfully.")
        
        return jsonify({'status': 'success', 'message': 'Stock removed from favorites'})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500
    


# 백테스트 페이지에서 분석 시작 버튼을 눌렀을때 실행
@app.route('/flask/analyze', methods=['POST', 'GET'])
def analyze_stock_route():
    if request.method == 'POST':
        try:
            data = request.json #사용자가 보낸 값을 제이슨으로 변환
            name = data['stockName'] # 주식 종목
            start_date = datetime.strptime(data['startDate'], '%Y-%m-%d') #시작 날짜
            end_date = datetime.strptime(data['endDate'], '%Y-%m-%d') #종료 날짜
            initial_investment = float(data['initialInvestment'])#초기 투자금
            rebalance_period = data['rebalancePeriod'] #리밸런싱 주기 설정

            connection = get_db_connection() #데이터 베이스 연결
            if connection is None:
                return jsonify({'error': '데이터베이스 연결 실패'}), 500

            df = get_stock_data(connection, name) # 주식 정보 가져오기
            
            if df.empty:
                return jsonify({'error': f'{name} 주식의 데이터가 부족합니다.'}), 400
            #주식 정보들을 모델 학습하기 위한 데이터 전처리 후 판다스에 추가
            df = preprocess_data(df)
            df = add_technical_indicators(df)

            results, loss, mae = analyze_stock(
                df, 
                FEATURES, 
                'closing_price', 
                start_date, 
                end_date, 
                initial_investment, 
                rebalance_period
            )

            final_value = results[-1]['predicted_value'] if results else initial_investment

            return jsonify({
                'processedData': results,
                'stockName': name,
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d'),
                'initialInvestment': initial_investment,
                'finalPredictedValue': round(final_value, 2),
                'totalReturn': round((final_value - initial_investment) / initial_investment * 100, 2),
                'modelMAE': round(float(mae), 4)
            })

        except Exception as e:
            logger.exception(f"Error occurred: {str(e)}")
            return jsonify({'error': str(e)}), 500
        finally:
            if 'connection' in locals():
                connection.close()
    elif request.method == 'GET':
        return jsonify({'message': 'Please use POST method to analyze stock data'}), 400
    
   
if __name__ == "__main__":
    app.run(debug=True)