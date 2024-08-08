package com.example.stock.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.example.stock.domain.StockInterestVO;
import com.example.stock.domain.StockVO;

@Mapper
public interface StockDAO {
	List<StockVO> selectStockList(@Param("lastId") String lastId, @Param("search") String search, @Param("limit") int limit);
    StockVO getStockInfo(@Param("stock_code") String stockCode);
    List<StockVO> getYearlyStockPriceHistory(@Param("stock_code") String stockCode);
    boolean isStockInterestExists(StockInterestVO stockInterest);
    void insertStockInterest(StockInterestVO stockInterest);
    void deleteStockInterest(StockInterestVO stockInterest);

}