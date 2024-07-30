package com.example.stock.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.stock.domain.StockVO;
import com.example.stock.service.StockService;

@CrossOrigin(origins = "http://localhost:3000") //리액트의 노드서버와의 크로스 오리진 문제 해결
@RestController
public class StockController {
	
	 private static final Logger logger = LoggerFactory.getLogger(StockController.class);
	
	@Autowired
	private StockService stockService;
	
	
	@GetMapping("/stocks")
	public List<StockVO> stockList() {
	    return stockService.selectStockList();
	}
	
	@GetMapping("/stock/{stock_code}")
    public ResponseEntity<Map<String, Object>> getStockDetail(
            @PathVariable String stock_code,
            @RequestParam(defaultValue = "1D") String range) {
        
        StockVO stockInfo = stockService.getStockInfo(stock_code);
        List<StockVO> priceHistory = stockService.getStockPriceHistory(stock_code, range);
        
        Map<String, Object> response = new HashMap<>();
        response.put("stockInfo", stockInfo);
        response.put("priceHistory", priceHistory);
        
        return ResponseEntity.ok(response);
    }
	
}//end of StockController
 