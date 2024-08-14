package com.example.stock.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.stock.domain.StockVO;

@Mapper
public interface StockDAO {

	List<StockVO> selectStockList(@Param("lastId") String lastId, @Param("search") String search, @Param("limit") int limit);

    StockVO getStockInfo(@Param("stock_code") String stockCode);

    List<StockVO> getYearlyStockPriceHistory(@Param("stock_code") String stockCode);

    List<StockVO> autocompleteStocks(@Param("query") String query);

    List<StockVO> selectTopInterestedStocks(@Param("limit") int limit);
}