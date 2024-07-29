from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from technical_indicators.indicators import add_technical_indicators
from models.random_forest_model import prepare_data_for_ml, create_model_pipeline

app = Flask(__name__)
CORS(app)  # 이 라인을 추가하여 CORS 이슈를 해결합니다.

@app.route('/analyze', methods=['POST'])
def analyze_stock():
    data = request.json
    stock_code = data['stockCode']
    start_date = data['startDate']
    end_date = data['endDate']
    initial_investment = data.get('initialInvestment', 10000)  # 기본값 10000
    rebalance_period = data.get('rebalancePeriod', 'monthly')  # 기본값 'monthly'

    connection_string = 'oracle+oracledb://final:final1234@localhost:1521/XE'
    engine = create_engine(connection_string)

    try:
        with engine.connect() as conn:
            query = f"""
                SELECT * FROM Stock 
                WHERE stock_code = '{stock_code}' 
                AND record_date BETWEEN TO_DATE('{start_date}', 'YYYY-MM-DD') 
                AND TO_DATE('{end_date}', 'YYYY-MM-DD')
            """
            df = pd.read_sql(query, conn)

        df = add_technical_indicators(df)

        X, y = prepare_data_for_ml(df, 'closing_price')

        if X is not None and len(X) > 60:
            model = create_model_pipeline()
            model.fit(X, y)

            latest_data = X.iloc[-1].values.reshape(1, -1)
            prediction_prob = model.predict_proba(latest_data)[0][1]

            # 백테스트 로직 추가
            df['position'] = np.where(df['SMA_20'] > df['EMA_20'], 1, 0)  # 간단한 매매 전략
            df['returns'] = df['closing_price'].pct_change()
            df['strategy_returns'] = df['position'].shift(1) * df['returns']
            
            cumulative_returns = (1 + df['strategy_returns']).cumprod()
            total_return = cumulative_returns.iloc[-1] - 1
            sharpe_ratio = np.sqrt(252) * df['strategy_returns'].mean() / df['strategy_returns'].std()

            result_data = df[['record_date', 'closing_price', 'SMA_20', 'EMA_20', 'RSI_14']].to_dict('records')

            return jsonify({
                'processedData': result_data,
                'predictionProbability': float(prediction_prob),
                'totalReturn': float(total_return),
                'sharpeRatio': float(sharpe_ratio)
            })
        else:
            return jsonify({'error': '데이터가 충분하지 않거나 유효하지 않습니다.'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        engine.dispose()

if __name__ == '__main__':
    app.run(debug=True, port=5000)