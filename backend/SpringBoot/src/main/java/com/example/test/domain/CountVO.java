package com.example.test.domain;

import java.util.Date;

import lombok.Data;

@Data
public class CountVO {
	private String sessionId;
	private Date creationTime;
}