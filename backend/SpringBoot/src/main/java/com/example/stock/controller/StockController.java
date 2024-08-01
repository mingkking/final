package com.example.stock.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.stock.domain.StockVO;
import com.example.stock.service.StockService;

@CrossOrigin(origins="http://localhost:3000")
@RestController
public class StockController {
    
    private static final Logger logger = LoggerFactory.getLogger(StockController.class);
    
    @Autowired
    private StockService stockService;
    
    @GetMapping("/stock/search")
    public ResponseEntity<?> searchStocks(
            @RequestParam String query, 
            @RequestParam(required = false) String lastId,
            @RequestParam(defaultValue = "15") int limit) {
        try {
            List<StockVO> stocks = stockService.searchStocks(query, lastId, limit);
            boolean hasMore = stocks.size() == limit;
            String newLastId = hasMore ? stocks.get(stocks.size() - 1).getStock_code() : null;
            
            Map<String, Object> response = new HashMap<>();
            response.put("stocks", stocks);
            response.put("hasMore", hasMore);
            response.put("lastLoadedId", newLastId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error searching stocks", e);
            return ResponseEntity.internalServerError().body("Error searching stocks");
        }
    }
    
    @GetMapping("/stock/list")
    public ResponseEntity<?> listStocks(
            @RequestParam(required = false) String lastId,
            @RequestParam(defaultValue = "15") int limit) {
        try {
            List<StockVO> stocks = stockService.listStocks(lastId, limit);
            boolean hasMore = stocks.size() == limit;
            String newLastId = hasMore ? stocks.get(stocks.size() - 1).getStock_code() : null;
            
            Map<String, Object> response = new HashMap<>();
            response.put("stocks", stocks);
            response.put("hasMore", hasMore);
            response.put("lastLoadedId", newLastId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error listing stocks", e);
            return ResponseEntity.internalServerError().body("Error listing stocks");
        }
    }
    
    @GetMapping("/stock/{stock_code}")
    public ResponseEntity<?> getStockDetail(@PathVariable String stock_code) {
        logger.info("Fetching yearly stock detail for code: {}", stock_code);
        
        try {
            StockVO stockInfo = stockService.getStockInfo(stock_code);
            if (stockInfo == null) {
                logger.warn("No stock info found for code: {}", stock_code);
                return ResponseEntity.notFound().build();
            }
            
            List<StockVO> priceHistory = stockService.getYearlyStockPriceHistory(stock_code);
            if (priceHistory.isEmpty()) {
                logger.warn("No yearly price history found for code: {}", stock_code);
            } else {
                logger.info("Found {} yearly price history records for code: {}", priceHistory.size(), stock_code);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("stockInfo", stockInfo);
            response.put("priceHistory", priceHistory);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching yearly stock detail for code: " + stock_code, e);
            return ResponseEntity.internalServerError().body("Error fetching yearly stock detail");
        }
    
    }
}