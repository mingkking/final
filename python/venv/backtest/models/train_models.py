import oracledb
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from technical_indicators.indicators import add_technical_indicators
from data_processing.data_processor import preprocess_data

def create_connection():
    return oracledb.connect(user="investigate", password="team1", dsn="192.168.0.39:1521/XE")

def get_stock_data(connection, stock_name):
    cursor = connection.cursor()
    query = """
        SELECT * FROM INVESTIGATE.STOCK_INFO
        WHERE stock_name = :stock_name
        ORDER BY record_date
    """
    cursor.execute(query, name=stock_name)
    columns = [col[0].lower() for col in cursor.description]
    data = cursor.fetchall()
    return pd.DataFrame(data, columns=columns)

def prepare_data(df, sequence_length=10):
    features = ['closing_price', 'SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']
    df = df[features]
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df)
    
    X, y = [], []
    for i in range(len(scaled_data) - sequence_length):
        X.append(scaled_data[i:i+sequence_length])
        y.append(scaled_data[i+sequence_length, 0])  # predicting closing price
    
    return np.array(X), np.array(y), scaler

def build_model(input_shape):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    return model

def train_and_save_model(stock_name):
    connection = create_connection()
    df = get_stock_data(connection, stock_name)
    df = preprocess_data(df)
    df = add_technical_indicators(df)
    
    X, y, scaler = prepare_data(df)
    
    model = build_model((X.shape[1], X.shape[2]))
    model.fit(X, y, epochs=100, batch_size=32, validation_split=0.2, verbose=1)
    
    save_model(model, f'models/{stock_name}_model.h5')
    np.save(f'models/{stock_name}_scaler.npy', scaler.scale_)

if __name__ == "__main__":
    stock_names = ['삼성전자', 'SK하이닉스', '네이버']  # 학습할 주식 목록
    for stock in stock_names:
        print(f"Training model for {stock}")
        train_and_save_model(stock)
        print(f"Model for {stock} trained and saved")