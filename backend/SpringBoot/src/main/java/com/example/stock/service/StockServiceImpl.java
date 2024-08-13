package com.example.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.stock.dao.StockDAO;
import com.example.stock.domain.StockVO;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockDAO stockDAO;

    @Override
    public List<StockVO> searchStocks(String query, String lastId, int limit) {
        return stockDAO.selectStockList(lastId, query, limit);
    }

    @Override
    public StockVO getStockInfo(String stock_code) {
        return stockDAO.getStockInfo(stock_code);
    }

    @Override
    public List<StockVO> getYearlyStockPriceHistory(String stock_code) {
        return stockDAO.getYearlyStockPriceHistory(stock_code);
    }
    @Override
    public List<StockVO> autocompleteStocks(String query) {
        return stockDAO.autocompleteStocks(query);
    }
   
}