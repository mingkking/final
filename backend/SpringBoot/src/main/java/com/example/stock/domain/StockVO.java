package com.example.stock.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class StockVO {
	@JsonFormat(pattern = "yyyy-MM-dd")
	private String record_date; //날짜
	private String stock_code; //종목 코드
	private String stock_name; //종목이름
	private String stock_type; //종목 유형
	private Integer closing_price; //종가
	private Integer opening_price; //시작가
	private Integer high_price; // 고가
	private Integer low_price; // 저가
	private Integer compared_price; //대비
	private Long trading_volume;  //거래량
	private Long trading_amount; //거래대금
	private Long capitalization; //시가총액
	private Long listed_stocks; // 상장주식수
}
