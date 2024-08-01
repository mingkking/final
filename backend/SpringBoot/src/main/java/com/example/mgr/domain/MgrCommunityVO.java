package com.example.mgr.domain;
 
import java.util.Date; 

import lombok.Data;
 
@Data
public class MgrCommunityVO {
	private String id;
	private String user_num;
	private String title;
	private String contents;
	private int view_count;
	private Date created_at;
} 