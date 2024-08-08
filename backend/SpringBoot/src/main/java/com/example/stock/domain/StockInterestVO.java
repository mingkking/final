package com.example.stock.domain;

import lombok.Data;

@Data
public class StockInterestVO {
    
    private String stock_code;
    private Integer Stock_interest_num;
    private Integer user_num;
}
