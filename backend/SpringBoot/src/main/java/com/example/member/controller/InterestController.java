package com.example.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.member.Service.InterestService;
import com.example.member.domain.PropertyVO;
import com.example.stock.domain.StockVO;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InterestController {

	@Autowired
    private InterestService InterestService;

    @GetMapping("/user/{userNum}/interest")
    public List<StockVO> getUserStockInfo(@PathVariable Integer userNum) {
        return InterestService.getUserStockInfo(userNum);
    }
    
    @GetMapping("/user/{userNum}/property")
    public List<PropertyVO> getUserPropertyInfo(@PathVariable Integer userNum) {
        return InterestService.getUserPropertyInfo(userNum);
    }
}
