package com.example.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.BookmarkVO;

@Repository
public interface BookmarkRepository extends JpaRepository<BookmarkVO, Integer> {

    @Query(value = "SELECT * FROM BOOKMARK", nativeQuery = true)
    public List<BookmarkVO> selectAllBookmark() throws Exception;

    @Query(value = "DELETE FROM BOOKMARK WHERE user_num=?1 AND id=?2", nativeQuery = true)
    public void deleteBookmark(Integer userNum, Integer id) throws Exception;

}      
 