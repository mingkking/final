# backtest/daya_processing/data_processor.py
import pandas as pd
import numpy as np

def preprocess_data(df):
    # '-' 값을 NaN으로 변환
    df = df.replace('-', np.nan)
    
    # 숫자 컬럼들을 float 타입으로 변환
    numeric_columns = ['closing_price', 'opening_price', 'high_price', 'low_price']
    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    return df

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:(i + seq_length), :-1])
        y.append(data[i + seq_length, -1])
    return np.array(X), np.array(y)
