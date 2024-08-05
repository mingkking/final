# backtest/database/db_operaions.py
import oracledb
import time
from datetime import datetime, timedelta
# from data_collection.krx_data_fetcher import get_krx_stock_data
from backtest.data_collection.krx_data_fetcher import get_krx_stock_data
oracledb.init_oracle_client()

import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, project_root)

def create_connection():
    try:
        #connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE") #데이터 베이스 연결에 필요한 정보들 입력
        connection = oracledb.connect(user="investigate", password="team1", dsn="13.125.176.132:1521/XE") #아마존 데이터베이스 연결시
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
    
    # MERGE statement for STOCK table (Oracle 11g compatible)
    merge_stock_sql = """
    MERGE INTO STOCK s
    USING (SELECT :1 as stock_code, :2 as stock_name FROM DUAL) d
    ON (s.stock_code = d.stock_code)
    WHEN MATCHED THEN
        UPDATE SET s.stock_name = d.stock_name
    WHEN NOT MATCHED THEN
        INSERT (stock_code, stock_name)
        VALUES (d.stock_code, d.stock_name)
    """
    
    insert_stock_info_sql = """
    INSERT INTO INVESTIGATE.STOCK_INFO 
    (record_date, stock_code, stock_name, stock_type, closing_price, opening_price, high_price, low_price, compared_price, trading_volume, trading_amount, capitalization, listed_stocks)
    VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13)
    """
    
    def safe_float(value):
        try:
            return float(value.replace(',', '')) if value and value != '-' else None
        except ValueError:
            return None

    stock_records = []
    stock_info_records = []
    for item in data:
        try:
            stock_type = item.get("MKT_NM", "")
            if stock_type in ["KOSPI"]:
                stock_code = item.get('ISU_SRT_CD', '')
                stock_name = item.get('ISU_ABBRV', '')
                
                stock_records.append((stock_code, stock_name))
                
                stock_info_record = (
                    datetime.strptime(date, '%Y%m%d'),
                    stock_code,
                    stock_name,
                    stock_type,
                    safe_float(item.get('TDD_CLSPRC', '0')),
                    safe_float(item.get('TDD_OPNPRC', '0')),
                    safe_float(item.get('TDD_HGPRC', '0')),
                    safe_float(item.get('TDD_LWPRC', '0')),
                    safe_float(item.get('CMPPREVDD_PRC', '0')),
                    safe_float(item.get('ACC_TRDVOL', '0')),
                    safe_float(item.get('ACC_TRDVAL', '0')),
                    safe_float(item.get('MKTCAP', '0')),
                    safe_float(item.get('LIST_SHRS', '0'))
                )
                stock_info_records.append(stock_info_record)
        except (ValueError, KeyError) as e:
            print(f"Error processing item: {e}")
            print(f"Problematic item: {item}")
    
    if stock_records and stock_info_records:
        try:
            # Process in batches of 1000
            batch_size = 1000
            for i in range(0, len(stock_records), batch_size):
                batch = stock_records[i:i+batch_size]
                cursor.executemany(merge_stock_sql, batch)
                connection.commit()
                print(f"Processed {len(batch)} STOCK records")
            
            for i in range(0, len(stock_info_records), batch_size):
                batch = stock_info_records[i:i+batch_size]
                cursor.executemany(insert_stock_info_sql, batch)
                connection.commit()
                print(f"Processed {len(batch)} STOCK_INFO records")
            
            print(f"Data saved for {date}. Total records: {len(stock_info_records)}")
        except oracledb.DatabaseError as e:
            error, = e.args
            print("Oracle-Error-Code:", error.code)
            print("Oracle-Error-Message:", error.message)
            connection.rollback()
    else:
        print(f"No valid records to insert for {date}")

    # Print the first record for debugging
    if stock_info_records:
        print("First record:", stock_info_records[0])
        
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