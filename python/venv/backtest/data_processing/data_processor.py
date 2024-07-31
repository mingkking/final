import pandas as pd
import numpy as np

def preprocess_data(df):
    # '-' 값을 NaN으로 변환
    df = df.replace('-', np.nan)
    
    # 숫자 컬럼들을 float 타입으로 변환
    numeric_columns = ['closing_price', 'opening_price', 'high_price', 'low_price']
    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # NaN 값을 해당 종목의 평균값으로 대체
    for col in numeric_columns:
        df[col] = df[col].fillna(df[col].mean())
    
    return df

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:(i + seq_length), :-1])
        y.append(data[i + seq_length, -1])
    return np.array(X), np.array(y)