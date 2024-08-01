package com.example.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.stock.dao.StockDAO;
import com.example.stock.domain.StockVO;

@Service
public class StockServiceImpl implements StockService{
	
	@Autowired
	private StockDAO stockDAO;

	@Override //주식 목록 조회
	public List<StockVO> selectStockList(int limit, String lastId, String search) {
	    return stockDAO.selectStockList(limit, lastId,search);
	}

	@Override //주식 상세 조회
	public StockVO getStockInfo(String stock_code) {
	    return stockDAO.getStockInfo(stock_code);
	}

	@Override
	public List<StockVO> getStockPriceHistory(String stock_code, String range) {
	    return stockDAO.getStockPriceHistory(stock_code, range);
	}
	 @Override
	    public List<StockVO> getYearlyStockPriceHistory(String stock_code) {
	        return stockDAO.getYearlyStockPriceHistory(stock_code);
	    }
	

} 
