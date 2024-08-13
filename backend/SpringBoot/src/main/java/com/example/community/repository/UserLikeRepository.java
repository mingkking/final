package com.example.community.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.UserLikeVO;

@Repository
public interface UserLikeRepository extends JpaRepository<UserLikeVO, Integer> {

    @Query(value = "SELECT * FROM USERLIKE", nativeQuery = true)
    public List<UserLikeVO> selectAllUserLike() throws Exception;

    @Query(value = "DELETE FROM USERLIKE WHERE user_num=?1 AND id=?2", nativeQuery = true)
    public void deleteUserLike(Integer userNum, Integer id) throws Exception;
    
    @Query(value = "SELECT id, count(*) FROM USERLIKE GROUP BY id", nativeQuery = true)
    public Map<String, Integer> selectAllUserLikeCnt() throws Exception;
    

}      
 