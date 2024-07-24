import oracledb
from datetime import datetime, timedelta
from database.db_operations import safe_execute, get_and_save_data_for_date_range
from data_processing.data_processor import preprocess_data
from technical_indicators.indicators import add_technical_indicators
from models.random_forest_model import prepare_data_for_ml, create_model_pipeline
from sqlalchemy import create_engine
import pandas as pd

if __name__ == "__main__":
    try:
        oracledb.init_oracle_client(lib_dir=r"C:\Users\ict03_013\Oracle\instantclient_11_2")
        
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=730)  # 약 2년 전
        
        # Uncomment the following line to fetch and save data
        # safe_execute(get_and_save_data_for_date_range, start_date, end_date)

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
            X, y = prepare_data_for_ml(stock_df, 'closing_price')
            
            if len(X) > 60:  # 최소 60일의 데이터가 필요
                # 모델 생성 및 학습
                model = create_model_pipeline()
                model.fit(X, y)
                
                # 다음 날의 주가 상승 확률 예측
                latest_data = X.iloc[-1].values.reshape(1, -1)
                prediction_prob = model.predict_proba(latest_data)[0][1]
                print(f"{stock_code}의 다음 날 주가 상승 확률: {prediction_prob:.2f}")
            else:
                print(f"{stock_code}의 데이터가 충분하지 않습니다.")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        import traceback
        print(traceback.format_exc())
    finally:
        if 'engine' in locals():
            engine.dispose()
            print("Database connection closed.")