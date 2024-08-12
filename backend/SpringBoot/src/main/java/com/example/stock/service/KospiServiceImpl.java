package com.example.stock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.stock.dao.KospiDAO;
import com.example.stock.domain.KospiVO;

@Service
public class KospiServiceImpl implements KospiService {
    @Autowired
    private KospiDAO kospiDAO;

    @Override
    public List<KospiVO> getMonthlyKospiData() {
        return kospiDAO.getMonthlyKospiData();
    }
}
