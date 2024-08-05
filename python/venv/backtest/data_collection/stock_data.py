# backtest/data_collection/stock_data.py
import logging
from datetime import datetime, timedelta
from data_collection.krx_data_fetcher import get_krx_stock_data
from database.db_operations import create_connection, get_and_save_data_for_date_range

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def collect_one_year_data():
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)

    logger.info(f"데이터 수집 시작: {start_date.date()} to {end_date.date()}")

    connection = create_connection()
    if connection:
        try:
            get_and_save_data_for_date_range(connection, start_date, end_date)
            logger.info("데이터 수집 완료")
        except Exception as e:
            logger.error(f"데이터 수집 중 오류 발생: {str(e)}", exc_info=True)
        finally:
            connection.close()
    else:
        logger.error("데이터베이스 연결 실패")

    # 수집된 데이터 확인
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM INVESTIGATE.STOCK_INFO WHERE record_date BETWEEN :start_date AND :end_date",
                           start_date=start_date, end_date=end_date)
            count = cursor.fetchone()[0]
            logger.info(f"수집된 레코드 수: {count}")
        except Exception as e:
            logger.error(f"데이터 확인 중 오류 발생: {str(e)}", exc_info=True)
        finally:
            connection.close()
    else:
        logger.error("데이터베이스 연결 실패")

if __name__ == "__main__":
    collect_one_year_data()
