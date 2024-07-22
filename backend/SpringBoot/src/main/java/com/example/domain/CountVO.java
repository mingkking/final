package com.example.domain;

import java.util.Date;

import lombok.Data;

@Data
public class CountVO {
	private String sessionId;
	private Date creationTime;
}