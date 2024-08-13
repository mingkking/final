package com.example.member.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.member.domain.PropertyVO;
import com.example.stock.domain.StockVO;

@Mapper
public interface InterestDAO {

	List<StockVO> getUserStockInfo(Integer userNum);
	List<PropertyVO> getUserPropertyInfo(Integer userNum);
}
