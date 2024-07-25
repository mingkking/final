package com.example.mgr.domain;
 
import java.util.Date; 

import lombok.Data;
 
@Data
public class MgrMemberVO {
	private String user_num;
	private Date   created_at;
	private String refresh_token;
	private String user_email;
	private String user_id;
	private String user_name;
	private String user_nickname;
	private String user_pass;
	private String user_tel;
}