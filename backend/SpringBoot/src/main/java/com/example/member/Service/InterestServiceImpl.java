package com.example.member.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.member.dao.InterestDAO;
import com.example.member.domain.PropertyVO;
import com.example.stock.domain.StockVO;

@Service
public class InterestServiceImpl implements InterestService{
	
	@Autowired
	private InterestDAO interestDAO;

    public List<StockVO> getUserStockInfo(Integer userNum) {
        return interestDAO.getUserStockInfo(userNum);
    }
    
    public List<PropertyVO> getUserPropertyInfo(Integer userNum) {
        return interestDAO.getUserPropertyInfo(userNum);
    }
}
