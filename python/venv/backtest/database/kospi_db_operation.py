import yfinance as yf
import oracledb
from datetime import datetime, timedelta
oracledb.init_oracle_client()
def create_connection():
    try:
        connection = oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")
        print("Database connection established successfully.")
        return connection
    except oracledb.Error as e:
        print(f"Error connecting to Oracle Database: {e}")
        return None

def ensure_kospi_entry(connection, kospi_code, kospi_name):
    cursor = connection.cursor()
    check_query = "SELECT 1 FROM KOSPI WHERE kospi_code = :1"
    insert_query = "INSERT INTO KOSPI (kospi_code, kospi_name) VALUES (:1, :2)"
    
    cursor.execute(check_query, (kospi_code,))
    if not cursor.fetchone():
        try:
            cursor.execute(insert_query, (kospi_code, kospi_name))
            connection.commit()
            print(f"Inserted new KOSPI entry: {kospi_code}")
        except oracledb.Error as e:
            print(f"Error inserting KOSPI entry: {e}")
            connection.rollback()

def get_kospi_data(start_date, end_date):
    kospi = yf.Ticker("^KS11")  # KOSPI 지수의 야후 파이낸스 심볼
    data = kospi.history(start=start_date, end=end_date + timedelta(days=1))
    return data

def save_kospi_data(connection, data):
    cursor = connection.cursor()
    insert_query = """
    INSERT INTO KOSPI_INFO 
    (record_date, kospi_code, kospi_name, closing_price, opening_price, high_price, low_price, compared_price, trading_volue)
    VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)
    """
    
    records_saved = 0
    for date, row in data.iterrows():
        try:
            compared_price = row['Close'] - row['Open']
            cursor.execute(insert_query, (
                date.date(),
                'KOSPI',
                '코스피지수',
                float(row['Close']),
                float(row['Open']),
                float(row['High']),
                float(row['Low']),
                float(compared_price),
                int(row['Volume'])
            ))
            records_saved += 1
            connection.commit()
            print(f"Saved data for {date.date()}")
        except oracledb.Error as e:
            print(f"Error inserting data for {date.date()}: {e}")
            connection.rollback()
    
    return records_saved

def main():
    connection = create_connection()
    if not connection:
        return

    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=365)

    print(f"Fetching KOSPI data from {start_date} to {end_date}")
    
    # Ensure KOSPI entry exists
    ensure_kospi_entry(connection, 'KOSPI', '코스피지수')
    
    # Fetch data
    kospi_data = get_kospi_data(start_date, end_date)
    
    if not kospi_data.empty:
        # Save data
        records_saved = save_kospi_data(connection, kospi_data)
        print(f"Total records saved: {records_saved}")
    else:
        print("Failed to fetch KOSPI data")

    connection.close()

if __name__ == "__main__":
    main()