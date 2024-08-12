from flask import request,jsonify
import logging
from ..Flask import get_db_connection

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
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
                SELECT COUNT(*) FROM (
                    SELECT S.*
                    FROM INVESTIGATE.STOCK_INTEREST AS S
                    WHERE S.USER_NUM = :user_num AND S.STOCK_CODE = :stock_code
                )
                """
                cursor.execute(check_query, user_num=user_num, stock_code=stock_code)
                count = cursor.fetchone()[0]
                
                return jsonify({'isFavorite': count > 0})
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500


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