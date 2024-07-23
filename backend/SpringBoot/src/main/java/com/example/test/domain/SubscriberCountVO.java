package com.example.test.domain;

import java.sql.Timestamp;
import java.util.Date;

import lombok.Data;

@Data
public class SubscriberCountVO {
	private String id;
	private String user_id;
	private String amount;
	private Timestamp payment_date;
}