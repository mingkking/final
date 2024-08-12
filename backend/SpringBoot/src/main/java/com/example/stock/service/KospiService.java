package com.example.stock.service;

import java.util.List;

import com.example.stock.domain.KospiVO;

public interface KospiService {
    List<KospiVO> getMonthlyKospiData();
}
