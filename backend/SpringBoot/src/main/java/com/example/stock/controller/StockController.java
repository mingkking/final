package com.example.stock.controller;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.stock.domain.StockVO;
import com.example.stock.service.StockService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/spring")
public class StockController {

    private static final Logger logger = LoggerFactory.getLogger(StockController.class);

    @Autowired
    private StockService stockService;

    @GetMapping("/MainstockList")
    public ResponseEntity<List<StockVO>> getTopInterestedStocks() {
        try {
            List<StockVO> topStocks = stockService.getTopInterestedStocks();
            return ResponseEntity.ok(topStocks);
        } catch (Exception e) {
            logger.error("Error fetching top interested stocks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 주식 리스트에서 검색기능
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
            response.put("stocks", stocks); // 종목들을 리스트에 더 출력
            response.put("hasMore", hasMore); // 무한 스크롤에서 더 출력 할지 말지 정해주는 변수
            response.put("lastLoadedId", newLastId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error searching stocks", e);
            return ResponseEntity.internalServerError().body("Error searching stocks");
        }
    }

    // 해당 주식 종목 상세보기 컨트롤러
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
            response.put("stockInfo", stockInfo); // 해당 종목 정보
            response.put("priceHistory", priceHistory); // 종목에 있는 1년치 데이터

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching yearly stock detail for code: " + stock_code, e);
            return ResponseEntity.internalServerError().body("Error fetching yearly stock detail");
        }
    }
    @GetMapping("/stocks/autocomplete")
    public ResponseEntity<?> autocompleteStocks(@RequestParam String query) {
        try {
            List<StockVO> stocks = stockService.autocompleteStocks(query);
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            logger.error("Error in stock autocomplete", e);
            return ResponseEntity.internalServerError().body("Error in stock autocomplete");
        }
    }

}