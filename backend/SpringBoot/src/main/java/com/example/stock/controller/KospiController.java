package com.example.stock.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.stock.domain.KospiVO;
import com.example.stock.service.KospiService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
// @RequestMapping("/spring")
public class KospiController {

    @Autowired
    private KospiService kospiService;

     @GetMapping("/kospi")
    public ResponseEntity<?> getMonthlyKospiData() {
        try {
            List<KospiVO> kospiData = kospiService.getMonthlyKospiData();
            List<Map<String, Object>> result = new ArrayList<>();

            for (KospiVO k : kospiData) {
                if (k != null) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("recordDate", k.getRecord_date() != null ? k.getRecord_date().toString() : null);
                    map.put("closingPrice", k.getClosing_price());
                    result.add(map);
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("데이터를 가져오는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}