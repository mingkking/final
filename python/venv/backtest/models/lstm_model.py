
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from datetime import timedelta

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
    # 수익률 계산
    df['returns'] = df[target].pct_change()
    
    # NaN 값을 평균으로 대체
    for column in features:
        df[column] = df[column].fillna(df[column].mean())
    
    data = df[features].values
    scaler = MinMaxScaler()
    data_scaled = scaler.fit_transform(data)
    
    # X, y = [], []
    # for i in range(len(data_scaled) - seq_length):
    #     X.append(data_scaled[i:(i + seq_length)])
    #     y.append(data_scaled[i + seq_length, 0])  # closing_price를 타겟으로 사용
    
    # X, y = np.array(X), np.array(y)
    # return train_test_split(X, y, test_size=0.2, random_state=42), scaler

    X, y = create_sequences(data_scaled, seq_length)
    return train_test_split(X, y, test_size=0.2, random_state=42), scaler

def train_lstm_model(X_train, y_train):
    model = build_lstm_model((X_train.shape[1], X_train.shape[2]))
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    history = model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2, callbacks=[early_stopping], verbose=1)
    return model, history

def evaluate_lstm_model(model, X_test, y_test):
    loss, mae = model.evaluate(X_test, y_test, verbose=0)
    #print(loss,mae)
    return loss, mae

def predict_future(model, scaler, last_sequence, days_to_predict, initial_investment):
    predictions = []
    current_sequence = last_sequence.copy()
    current_value = initial_investment

    for _ in range(days_to_predict):
        # 다음 날의 종가 예측
        scaled_prediction = model.predict(current_sequence.reshape(1, current_sequence.shape[0], current_sequence.shape[1]))
        
        # 예측된 종가를 포함한 전체 특성 벡터 생성
        full_feature_vector = current_sequence[-1].copy()
        full_feature_vector[0] = scaled_prediction[0][0]  # 첫 번째 특성이 종가라고 가정
        
        # 전체 특성 벡터 역변환
        unscaled_vector = scaler.inverse_transform(full_feature_vector.reshape(1, -1))[0]
        predicted_close = unscaled_vector[0]  # 첫 번째 특성이 종가
        
        # 수익률 계산
        if len(predictions) > 0:
            previous_close = scaler.inverse_transform(current_sequence[-1].reshape(1, -1))[0][0]
            predicted_return = (predicted_close - previous_close) / previous_close
        else:
            predicted_return = 0
        
        # 예측 결과 저장
        predictions.append({
            'predicted_close': predicted_close,
            'predicted_return': predicted_return,
            'predicted_value': current_value * (1 + predicted_return),
            'predicted_movement': 'Up' if predicted_return > 0 else 'Down'
        })

        # 현재 시퀀스 업데이트
        new_sequence = np.roll(current_sequence, -1, axis=0)
        new_sequence[-1] = full_feature_vector
        current_sequence = new_sequence

        # 투자 가치 업데이트
        current_value *= (1 + predicted_return)

    return predictions
def apply_rebalancing(predictions, rebalance_period, initial_investment):
    rebalanced_predictions = []
    current_value = initial_investment
    last_rebalance_day = 0

    for i, pred in enumerate(predictions):
        if rebalance_period == 'monthly' and (i + 1) % 30 == 0:
            current_value = initial_investment
        elif rebalance_period == 'quarterly' and (i + 1) % 90 == 0:
            current_value = initial_investment
        elif rebalance_period == 'annually' and (i + 1) % 365 == 0:
            current_value = initial_investment

        predicted_return = pred['predicted_return']
        current_value *= (1 + predicted_return)

        rebalanced_predictions.append({
            'date': (pred['date'] if 'date' in pred else None),
            'predicted_return_percentage': round(predicted_return * 100, 2),
            'predicted_value': round(current_value, 2),
            'predicted_movement': pred['predicted_movement']
        })

    return rebalanced_predictions
# 메인 분석 함수
def analyze_stock(df, features, target, start_date, end_date, initial_investment, rebalance_period):
    (X_train, X_test, y_train, y_test), scaler = prepare_data_for_lstm(df, features, target)
    model, history = train_lstm_model(X_train, y_train)
    loss, mae = evaluate_lstm_model(model, X_test, y_test)

    last_sequence = df[features].values[-10:]
    scaled_last_sequence = scaler.transform(last_sequence)

    days_to_predict = (end_date - start_date).days + 1
    predictions = predict_future(model, scaler, scaled_last_sequence, days_to_predict, initial_investment)
    
    # 날짜 추가
    for i, pred in enumerate(predictions):
        pred['date'] = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')

    rebalanced_predictions = apply_rebalancing(predictions, rebalance_period, initial_investment)

    return rebalanced_predictions, loss, mae