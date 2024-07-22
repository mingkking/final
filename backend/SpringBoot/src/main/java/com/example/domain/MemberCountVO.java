package com.example.domain;

import java.util.Date;

import lombok.Data;

@Data
public class MemberCountVO {
	private String user_num;
	private String refresh_token;
	private String user_email;
	private String user_id;
	private String user_nickname;
	private String user_pass;
	private String user_tel;
}