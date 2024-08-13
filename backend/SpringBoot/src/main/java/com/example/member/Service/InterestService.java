package com.example.member.Service;

import java.util.List;

import com.example.member.domain.PropertyVO;
import com.example.stock.domain.StockVO;

public interface InterestService {
	public List<StockVO> getUserStockInfo(Integer userNum);
	public List<PropertyVO> getUserPropertyInfo(Integer userNum);
}
