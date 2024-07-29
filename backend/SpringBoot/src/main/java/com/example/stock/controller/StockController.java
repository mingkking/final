package com.example.stock.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
	
	@Autowired
	private StockService stockService;
	      
	
	@GetMapping("/stocks")
	public List<StockVO> stockList(
	    @RequestParam(defaultValue = "1") int page,
	    @RequestParam(defaultValue = "20") int size) {
	    
	    PageRequest pageRequest = PageRequest.of(page - 1, size);
	    return stockService.selectStock(pageRequest);
	}
	
	 @GetMapping("/{stockCode}") // 종목 상세조회
	    public StockVO stockDetail(@PathVariable String stockCode) {
	        StockVO vo = new StockVO();
	        vo.setStock_code(stockCode);
	        return stockService.selectStockDetail(vo); 
	    }
	
}//end of StockController
 