package com.example.stock.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.example.stock.domain.StockVO;

@Mapper
public interface StockDAO {
    List<StockVO> selectStockList(PageRequest pageRequest); //종목 목록조회
    StockVO selectStockDetail(StockVO vo); //종목 상세조회
}