package com.example.stock.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;

import com.example.stock.domain.StockInterestVO;
import com.example.stock.domain.StockVO;

public interface StockService {

	//종목 목록 검색
    List<StockVO> searchStocks(String query, String lastId, int limit);
    //해당 종목 정보 가져오기
    StockVO getStockInfo(String stock_code);
    //종목 값 가져오기
    List<StockVO> getYearlyStockPriceHistory(String stock_code);
    //주식 관심등록
    boolean toggleFavorite(StockInterestVO stockInterest);
}
