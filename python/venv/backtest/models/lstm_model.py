
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:(i + seq_length), :])
        y.append(data[i + seq_length, -1])
    return np.array(X), np.array(y)

def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    return model

def prepare_data_for_lstm(df, features, target, seq_length=10):
    # 수익률 계산 (필요하다면)
    df['returns'] = df[target].pct_change()
    
    # NaN 값을 평균으로 대체
    for column in features:
        df[column] = df[column].fillna(df[column].mean())
    
    data = df[features].values
    scaler = MinMaxScaler()
    data_scaled = scaler.fit_transform(data)
    
    X, y = [], []
    for i in range(len(data_scaled) - seq_length):
        X.append(data_scaled[i:(i + seq_length)])
        y.append(data_scaled[i + seq_length, 0])  # closing_price를 타겟으로 사용
    
    X, y = np.array(X), np.array(y)
    return train_test_split(X, y, test_size=0.2, random_state=42), scaler

def train_lstm_model(X_train, y_train):
    model = build_lstm_model((X_train.shape[1], X_train.shape[2]))
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    history = model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2, callbacks=[early_stopping], verbose=1)
    return model, history

def evaluate_lstm_model(model, X_test, y_test):
    loss, mae = model.evaluate(X_test, y_test, verbose=0)
    return loss, mae