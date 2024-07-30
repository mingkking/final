#backtest/technical_indcators/indicators.py
import pandas as pd
import numpy as np

# 기술적 지표 계산 함수들

#단순이동평균 계산
def calculate_sma(df, window): 
    return df['closing_price'].rolling(window=window).mean()

#이동평균선
def calculate_ema(df, window): 
    return df['closing_price'].ewm(span=window, adjust=False).mean()

#상대적 강도지수 계산
def calculate_rsi(df, window): 
    delta = df['closing_price'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

#이동평균 수렴확산 지수
def calculate_macd(df, short_window, long_window, signal_window):
    short_ema = calculate_ema(df, short_window)
    long_ema = calculate_ema(df, long_window)
    macd = short_ema - long_ema
    signal = macd.ewm(span=signal_window, adjust=False).mean()
    histogram = macd - signal
    return pd.DataFrame({
        'MACD': macd,
        'Signal': signal,
        'Histogram': histogram
    })
    
#불린저 밴드 계산
def calculate_bollinger_bands(df, window, num_std):
    sma = calculate_sma(df, window)
    std = df['closing_price'].rolling(window=window).std()
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)
    return pd.DataFrame({
        'MiddleBand': sma,
        'UpperBand': upper_band,
        'LowerBand': lower_band
    })

#변동성 지표 계산
def calculate_atr(df, window):
    """변동성 지표: ATR(Average True Range)"""
    high_low = df['high_price'] - df['low_price']
    high_close = np.abs(df['high_price'] - df['closing_price'].shift())
    low_close = np.abs(df['low_price'] - df['closing_price'].shift())
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)
    return true_range.rolling(window=window).mean()
#모맨텀 지표 계산
def calculate_roc(df, window):
    """모멘텀 지표: ROC(Rate of Change)"""
    return (df['closing_price'] - df['closing_price'].shift(window)) / df['closing_price'].shift(window) * 100

def add_technical_indicators(df):
    df['SMA_20'] = calculate_sma(df, 20)
    df['EMA_20'] = calculate_ema(df, 20)
    df['RSI_14'] = calculate_rsi(df, 14)
    
    macd_df = calculate_macd(df, 12, 26, 9)
    df = pd.concat([df, macd_df], axis=1)
    
    bb_df = calculate_bollinger_bands(df, 20, 2)
    df = pd.concat([df, bb_df], axis=1)
    
    df['ROC_10'] = calculate_roc(df, 10)
    df['ATR_14'] = calculate_atr(df, 14)
    
    return df