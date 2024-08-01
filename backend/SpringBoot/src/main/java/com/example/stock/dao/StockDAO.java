package com.example.stock.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.example.stock.domain.StockVO;

@Mapper
public interface StockDAO {
	List<StockVO> searchStocks(@Param("query") String query, @Param("lastId") String lastId, @Param("limit") int limit);
    List<StockVO> listStocks(@Param("lastId") String lastId, @Param("limit") int limit);
     //종목 목록조회
	StockVO getStockInfo(String stock_code);
	List<StockVO> getStockPriceHistory(@Param("stock_code") String stockCode, @Param("range") String range);
	List<StockVO> getYearlyStockPriceHistory(@Param("stock_code") String stockCode);
}