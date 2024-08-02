package com.example.subscribe.domain;
 
import java.util.Date;

import lombok.Data;
  
@Data
public class SubscribeVO {
	private int subscribe_num;
	private int user_num;
	private int amount;
	private Date payment_date;
}