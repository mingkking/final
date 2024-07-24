import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

def prepare_data_for_ml(df, target_column, days_ahead=5):
    df['target'] = (df[target_column].shift(-days_ahead) > df[target_column]).astype(int)
    features = ['SMA_20', 'EMA_20', 'RSI_14', 'MACD', 'Signal', 'Histogram', 'MiddleBand', 'UpperBand', 'LowerBand']
    df_clean = df.dropna(subset=features + ['target'])
    if df_clean.empty:
        print("After removing NaN values, the dataframe is empty.")
        return None, None
    return df_clean[features], df_clean['target']

def create_model_pipeline():
    model = Pipeline([
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=5, random_state=42))
    ])
    
    return model

def evaluate_model(model, X_test, y_test):
    predictions = model.predict(X_test)
    print(confusion_matrix(y_test, predictions))
    print(classification_report(y_test, predictions))