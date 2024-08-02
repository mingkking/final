package com.example.mgr.domain;
  
import java.sql.Timestamp;
import java.util.Date;

import lombok.Data;
 
@Data 
public class MgrSubscriberCountVO {
	private String id;
	private String user_id; 
	private String amount;
	private Timestamp payment_date;
}