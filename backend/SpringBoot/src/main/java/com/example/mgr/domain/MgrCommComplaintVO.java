package com.example.mgr.domain;
 
import java.util.Date; 

import lombok.Data;
 
@Data   
public class MgrCommComplaintVO {
	private int id;
	private int user_num; 
	private String type;
	private int type_num; // 커뮤니티 글 or 댓글 번호
	private String content; // 신고 내용
	private String contents; // 댓글 내용
	private Date created_at;
	private String user_name;
	private String title; // 제목
	private int commNum; // 댓글 상세보기 할 때 게시글 번호
} 