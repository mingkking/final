package com.example.stock.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;

import com.example.stock.domain.StockVO;

public interface StockService {

	//종목 리스트 조회
	List<StockVO> selectStock(PageRequest pageRequest);
	
	//종목 상세조회
	StockVO selectStockDetail(StockVO VO);
}
