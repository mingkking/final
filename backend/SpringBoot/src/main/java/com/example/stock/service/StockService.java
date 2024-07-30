package com.example.stock.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;

import com.example.stock.domain.StockVO;

public interface StockService {

	//종목 목록 조회
	List<StockVO> selectStockList();
	
	//종목 상세조회
	StockVO getStockInfo(String stockCode);
    List<StockVO> getStockPriceHistory(String stock_code, String range);
}
