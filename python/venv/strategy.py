import requests
from datetime import datetime, timedelta
import oracledb
import time
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt

# Oracle 클라이언트 초기화
oracledb.init_oracle_client(lib_dir=r"C:\Users\ict03_013\Oracle\instantclient_11_2")
connection = oracledb.connect(user="final", password='final1234', dsn="localhost:1521/XE")

def create_connection():
    try:
        connection = oracledb.connect(user="final", password='final1234', dsn="localhost:1521/XE")
        print("Database connection established successfully.")
        return connection
    except oracledb.Error as e:
        print(f"Error connecting to Oracle Database: {e}")
        return None

def check_connection(connection):
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT 1 FROM DUAL")
        cursor.close()
        return True
    except oracledb.Error:
        return False

def get_connection():
    global connection
    if 'connection' not in globals() or connection is None or not check_connection(connection):
        connection = create_connection()
    return connection

def safe_execute(func, *args, **kwargs):
    max_retries = 3
    retry_delay = 5  # seconds

    for attempt in range(max_retries):
        try:
            connection = get_connection()
            if connection is None:
                raise oracledb.InterfaceError("Failed to connect to the database")
            return func(connection, *args, **kwargs)
        except oracledb.Error as e:
            print(f"Database error occurred: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("Max retries reached. Operation failed.")
                raise

def get_krx_stock_data(date):
    url = "http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd"
    headers = {
        'Referer': 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    params = {
        'bld': 'dbms/MDC/STAT/standard/MDCSTAT01501',
        'locale': 'ko_KR',
        'mktId': 'ALL',
        'trdDd': date,
        'share': '1',
        'money': '1',
        'csvxls_isNo': 'false',
    } #한국 거래소 데이터베이스에서 데이터를 받아오기 위해서 요청 값들
    
    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    #데이터들 requests 라이브러리에 있는 get 요청을 보낸 후 data라는 변수에 json형식으로 저장
    
    if 'OutBlock_1' not in data or not data['OutBlock_1']:
        print(f"No data available for {date}")
        return None
    
    print(f"Number of items in OutBlock_1: {len(data['OutBlock_1'])}")
    return data['OutBlock_1']

def save_to_oracle(connection, data, date):
    cursor = connection.cursor()
    
    insert_sql = """
    INSERT INTO STOCK (record_date, stock_code, name, stock_type, closing_price, opening_price, high_price, low_price)
    VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
    """
    
    records = []
    for item in data:
        try:
            stock_type = item.get("MKT_NM","") # KOSPI 종목만 데이터베이스에 입력
            if stock_type in ["KOSPI"]:
                # '-' 문자를 None으로 변환
                closing_price = item.get('TDD_CLSPRC', '0').replace(',', '')
                opening_price = item.get('TDD_OPNPRC', '0').replace(',', '')
                high_price = item.get('TDD_HGPRC', '0').replace(',', '')
                low_price = item.get('TDD_LWPRC', '0').replace(',', '')
                
                record = (
                    datetime.strptime(date, '%Y%m%d').date(),
                    item.get('ISU_SRT_CD', ''),
                    item.get('ISU_ABBRV', ''),
                    stock_type,
                    float(closing_price) if closing_price != '-' else None,
                    float(opening_price) if opening_price != '-' else None,
                    float(high_price) if high_price != '-' else None,
                    float(low_price) if low_price != '-' else None
                )
                records.append(record) # 이전에 만들어둔 빈 리스트 records에 추가
        except (ValueError, KeyError) as e:
            print(f"Error processing item: {e}")
            print(f"Problematic item: {item}")
    
    if records:
        cursor.executemany(insert_sql, records)
        connection.commit()
        print(f"Data saved for {date}. Records: {len(records)}")
    else:
        print(f"No valid records to insert for {date}")

def get_and_save_data_for_date_range(connection, start_date, end_date):
    current_date = start_date
    while current_date <= end_date:
        if current_date.weekday() < 5:  # 0-4는 월-금
            date_str = current_date.strftime("%Y%m%d")
#             print(f"Fetching data for {date_str}")
            data = get_krx_stock_data(date_str)
            if data:
                save_to_oracle(connection, data, date_str)
            else:
                print(f"No data available for {date_str}")
            
            time.sleep(1)  # 1초 대기하여 API 요청 속도 제한
        
        current_date += timedelta(days=1) 

# 실행
try:
#     oracledb.init_oracle_client(lib_dir=r"C:\Users\ict03_013\Oracle\instantclient_11_2")
#     #oracle클라이언트를 통해서 데이터베이스에 접속이 가능하다.
#     connection = oracledb.connect(user="final", password='final1234', dsn="localhost:1521/XE")
#     #데이터 베이스에 접속하기위한 정보 값들
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=730)  # 약 2년 전
    
#     print(f"Fetching data from {start_date} to {end_date}")
    get_and_save_data_for_date_range(connection, start_date, end_date)

    # 저장된 데이터 확인
#     cursor = connection.cursor()
#     cursor.execute("SELECT COUNT(*) FROM STOCK")
#     count = cursor.fetchone()[0]
#     print(f"Total records in database: {count}")

#     query = "SELECT MIN(record_date), MAX(record_date) FROM STOCK"
#     cursor.execute(query)
#     min_date, max_date = cursor.fetchone()
#     print(f"Date range in database: from {min_date} to {max_date}")
except oracledb.DatabaseError as e:
    error, = e.args
    print(f"Database error occurred: {error.code} - {error.message}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
    import traceback
    print(traceback.format_exc())
finally:
    if 'connection' in locals() and connection:
        connection.close()

# 기술적 지표 계산 함수들
def calculate_sma(df, window):
    return df['closing_price'].rolling(window=window).mean()

def calculate_ema(df, window):
    return df['closing_price'].ewm(span=window, adjust=False).mean()


def calculate_rsi(df, window):
    delta = df['closing_price'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))


def calculate_macd(df, short_window, long_window, signal_window):
    short_ema = calculate_ema(df, short_window)
    long_ema = calculate_ema(df, long_window)
    macd = short_ema - long_ema
    signal = macd.ewm(span=signal_window, adjust=False).mean()
    histogram = macd - signal
    return pd.DataFrame({
        'MACD': macd,
        'Signal': signal,
        'Histogram': histogram
    })

def calculate_bollinger_bands(df, window, num_std):
    sma = calculate_sma(df, window)
    std = df['closing_price'].rolling(window=window).std()
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)
    return pd.DataFrame({
        'MiddleBand': sma,
        'UpperBand': upper_band,
        'LowerBand': lower_band
    })

def calculate_atr(df, window):
    """변동성 지표: ATR(Average True Range)"""
    high_low = df['high_price'] - df['low_price']
    high_close = np.abs(df['high_price'] - df['closing_price'].shift())
    low_close = np.abs(df['low_price'] - df['closing_price'].shift())
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)
    return true_range.rolling(window=window).mean()

def calculate_roc(df, window):
    """모멘텀 지표: ROC(Rate of Change)"""
    return (df['closing_price'] - df['closing_price'].shift(window)) / df['closing_price'].shift(window) * 100

def add_technical_indicators(df):
    df['SMA_20'] = calculate_sma(df, 20)
    df['EMA_20'] = calculate_ema(df, 20)
    df['RSI_14'] = calculate_rsi(df, 14)
    
    macd_df = calculate_macd(df, 12, 26, 9)
    df = pd.concat([df, macd_df], axis=1)
    
    bb_df = calculate_bollinger_bands(df, 20, 2)
    df = pd.concat([df, bb_df], axis=1)
    
    df['ROC_10'] = calculate_roc(df, 10)
    df['ATR_14'] = calculate_atr(df, 14)
    
    return df

# 머신러닝 모델 관련 함수들
def prepare_data_for_ml(df, target_column, days_ahead=5):
    df['target'] = (df[target_column].shift(-days_ahead) > df[target_column]).astype(int)
    df = df.dropna()
    return df

def create_and_train_model(X_train, y_train):
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    predictions = model.predict(X_test)
    print(confusion_matrix(y_test, predictions))
    print(classification_report(y_test, predictions))

def plot_feature_importance(model, feature_names):
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    plt.figure(figsize=(10,6))
    plt.title("Feature Importances")
    plt.bar(range(len(importances)), importances[indices])
    plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=90)
    plt.tight_layout()
    plt.show()

def preprocess_data(df):
    # '-' 값을 NaN으로 변환
    df = df.replace('-', np.nan)
    
    # 숫자 컬럼들을 float 타입으로 변환
    numeric_columns = ['closing_price', 'opening_price', 'high_price', 'low_price']
    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # NaN 값이 있는 행 제거
    df = df.dropna()
    
    return df

# 메인 실행 부분
if __name__ == "__main__":
    try:
        oracledb.init_oracle_client(lib_dir=r"C:\Users\ict03_013\Oracle\instantclient_11_2")
        
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=730)  # 약 2년 전
        
        safe_execute(get_and_save_data_for_date_range, start_date, end_date)

        # 데이터 로드 및 처리
        connection_string = 'oracle+oracledb://final:final1234@localhost:1521/XE'
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            df = pd.read_sql('SELECT * FROM Stock', conn)
        
        # 데이터 전처리
        df = preprocess_data(df)
        
        # 종목별로 그룹화
        grouped_df = dict(tuple(df.groupby('stock_code')))

        for stock_code, stock_df in grouped_df.items():
            print(f"Processing stock: {stock_code}")
            
            # 날짜순으로 정렬
            stock_df = stock_df.sort_values('record_date')
            
            # 기술적 지표 추가
            stock_df = add_technical_indicators(stock_df)
            
            # 머신러닝을 위한 데이터 준비
            stock_df = prepare_data_for_ml(stock_df, 'closing_price')
            
            if len(stock_df) > 60:  # 최소 60일의 데이터가 필요
                features = ['SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']
                X = stock_df[features]
                y = stock_df['target']
                
                # 학습 데이터와 테스트 데이터 분리
                X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                
                # 특성 스케일링
                scaler = StandardScaler()
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test)
                
                # 모델 생성 및 학습
                model = create_and_train_model(X_train_scaled, y_train)
                
                # 모델 평가
                evaluate_model(model, X_test_scaled, y_test)
                
                # 특성 중요도 시각화
                plot_feature_importance(model, features)
                
                # 다음 날의 주가 상승 확률 예측
                latest_data = scaler.transform(stock_df[features].iloc[-1].values.reshape(1, -1))
                prediction_prob = model.predict_proba(latest_data)[0][1]
                print(f"{stock_code}의 다음 날 주가 상승 확률: {prediction_prob:.2f}")
            else:
                print(f"{stock_code}의 데이터가 충분하지 않습니다.")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        import traceback
        print(traceback.format_exc())
    finally:
        if 'connection' in globals() and connection:
            try:
                connection.close()
                print("Database connection closed.")
            except oracledb.Error as e:
                print(f"Error closing database connection: {e}")
