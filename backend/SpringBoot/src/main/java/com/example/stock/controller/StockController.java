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

import com.example.stock.domain.StockInterestVO;
import com.example.stock.domain.StockVO;
import com.example.stock.service.StockService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class StockController {

    private static final Logger logger = LoggerFactory.getLogger(StockController.class);

    @Autowired
    private StockService stockService;

    // 주요 주식 게시판에 데이터를 보내는 컨트롤러
    @GetMapping("/MainstockList")
    public ResponseEntity<List<Map<String, Object>>> MainstockList() {
        try {
            List<Map<String, Object>> stockList = new ArrayList<>();

            // 여기서는 예시로 4개의 주식을 하드코딩했습니다. 실제로는 DB에서 가져와야 합니다.
            String[] stockCodes = { "005930", "000660", "051910", "012450" };

            for (String code : stockCodes) {
                StockVO stock = stockService.getStockInfo(code);
                if (stock != null) {
                    Map<String, Object> stockInfo = new HashMap<>();
                    stockInfo.put("stockName", stock.getStock_name());
                    stockInfo.put("comparedPrice", stock.getCompared_price());
                    stockList.add(stockInfo);
                }
            }

            return ResponseEntity.ok(stockList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 첫 메인 페이지에 있는 차트데이터 보내는 컨트롤러
    @GetMapping("/MainStock")
    public ResponseEntity getMethodName() {
        String stock_code = "005930";
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

    // 주식 관심등록
    @PostMapping("/api/stock/favorite")// api나중에 없애기
    public ResponseEntity<?> toggleFavorite(@RequestBody StockInterestVO stockInterest) {
        logger.info("Received request to toggle favorite: {}", stockInterest);
        if (stockInterest.getUser_num() == null || stockInterest.getStock_code() == null) {
            return ResponseEntity.badRequest().body("user_num and stock_code are required");
        }
        try {
            boolean result = stockService.toggleFavorite(stockInterest);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result ? "관심 종목에 추가되었습니다." : "관심 종목에서 제거되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error toggling favorite for stock code: " + stockInterest.getStock_code(), e);
            return ResponseEntity.internalServerError().body("관심 종목 처리 중 오류가 발생했습니다.");
        }
    }
}