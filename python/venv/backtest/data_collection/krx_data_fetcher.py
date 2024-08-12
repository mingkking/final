# backtest/data_collection/krx_data_fetcher.py
import requests

#한국 거래소에서 주식 데이터 신호를 보낼때 필요한 함수
def get_krx_stock_data(date):
    url = "http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd"
    headers = {
        'Referer': 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    params = {
        'bld': 'dbms/MDC/STAT/standard/MDCSTAT01501',
        'locale': 'ko_KR',
        'mktId': 'ALL',
        'trdDd': date,
        'share': '1',
        'money': '1',
        'csvxls_isNo': 'false',
    } #한국 거래소 데이터베이스에서 데이터를 받아오기 위해서 요청 값들
    
    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    #데이터들 requests 라이브러리에 있는 get 요청을 보낸 후 data라는 변수에 json형식으로 저장
    
    if 'OutBlock_1' not in data or not data['OutBlock_1']:
        print(f"No data available for {date}")
        return None
    
    print(f"Number of items in OutBlock_1: {len(data['OutBlock_1'])}")
    return data['OutBlock_1']