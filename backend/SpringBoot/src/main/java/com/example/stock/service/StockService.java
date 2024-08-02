package com.example.stock.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;

import com.example.stock.domain.StockVO;

public interface StockService {

	//종목 목록 조회
    List<StockVO> searchStocks(String query, String lastId, int limit);
    StockVO getStockInfo(String stock_code);
    List<StockVO> getYearlyStockPriceHistory(String stock_code);
}
