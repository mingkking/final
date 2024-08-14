package com.example.stock.service;

import java.util.List;

import com.example.stock.domain.StockVO;

public interface StockService {

	//종목 목록 검색
    List<StockVO> searchStocks(String query, String lastId, int limit);
    //해당 종목 정보 가져오기
    StockVO getStockInfo(String stock_code);
    //종목 값 가져오기
    List<StockVO> getYearlyStockPriceHistory(String stock_code);
    // 백테스트 종목 자동완성
    List<StockVO> autocompleteStocks(String query);

    List<StockVO> getTopInterestedStocks();

}
