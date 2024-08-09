package com.example.mgr.domain;
  
import java.sql.Timestamp;
import java.util.Date;

import lombok.Data;
 
@Data 
public class MgrSubscriberCountVO {
	private String subscribe_num;
	private String user_num; 
	private String amount;
	private Timestamp payment_date;
}