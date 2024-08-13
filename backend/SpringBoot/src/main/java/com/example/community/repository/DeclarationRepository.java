package com.example.community.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.DeclarationVO;

@Repository
public interface DeclarationRepository extends JpaRepository<DeclarationVO, Integer> {
    // 모든 신고 리스트
    @Query(value = "SELECT * FROM DECLARATION", nativeQuery = true)
    public List<DeclarationVO> selectAllDeclaration() throws Exception;
}
