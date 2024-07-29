package com.example.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.stock.dao.StockDAO;
import com.example.stock.domain.StockVO;

@Service
public class StockServiceImpl implements StockService{
	
	@Autowired
	private StockDAO stockDAO;

	@Override
	public List<StockVO> selectStock(PageRequest pageRequest) {
	    List<StockVO> stocks = stockDAO.selectStockList(pageRequest);
//	    for (StockVO stock : stocks) {
//	        log.info("Stock: {}", stock);
//	    }
	    return stocks;
	}

	@Override
	public StockVO selectStockDetail(StockVO VO) {
			return stockDAO.selectStockDetail(VO);
	}


}
