# backtest/database/db_operaions.py
import oracledb
import time
from datetime import datetime, timedelta
# from data_collection.krx_data_fetcher import get_krx_stock_data
from backtest.data_collection.krx_data_fetcher import get_krx_stock_data
oracledb.init_oracle_client()
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def create_connection():
    try:
        #connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE") #데이터 베이스 연결에 필요한 정보들 입력
        connection = oracledb.connect(user="investigate", password="team1", dsn="13.125.176.132:1521/XE")
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
    retry_delay = 5  # 5초

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

def save_to_oracle(connection, data, date):
    cursor = connection.cursor()
    
    insert_sql = """
    INSERT INTO INVESTIGATE.STOCK (record_date, stock_code, name, stock_type, closing_price, opening_price, high_price, low_price)
    VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
    """
    # insert_sql = """
    # INSERT INTO STOCK (record_date, stock_code, name, stock_type, closing_price, opening_price, high_price, low_price)
    # VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
    # """
    
    records = []
    for item in data:
        try:
            stock_type = item.get("MKT_NM","")
            if stock_type in ["KOSPI"]:
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
                records.append(record)
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
            data = get_krx_stock_data(date_str)
            if data:
                save_to_oracle(connection, data, date_str)
            else:
                print(f"No data available for {date_str}")
            
            time.sleep(1)  # 1초 대기하여 API 요청 속도 제한
        
        current_date += timedelta(days=1)
if __name__ == "__main__":
    start_date = datetime.now() - timedelta(days=365)
    end_date = datetime.now()
    
    connection = create_connection()
    if connection:
        try:
            get_and_save_data_for_date_range(connection, start_date, end_date)
        finally:
            connection.close()
    else:
        print("Failed to establish database connection.")