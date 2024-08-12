package com.example.stock.dao;

import java.util.List;
import com.example.stock.domain.KospiVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface KospiDAO {
    List<KospiVO> getMonthlyKospiData();
}