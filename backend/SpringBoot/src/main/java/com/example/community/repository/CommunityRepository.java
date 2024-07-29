package com.example.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.community.domain.CommunityVO;

@Repository
public interface CommunityRepository extends JpaRepository<CommunityVO, Integer> {
}      
 