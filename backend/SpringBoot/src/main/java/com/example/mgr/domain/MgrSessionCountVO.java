package com.example.mgr.domain;
   
import java.util.Date;

import lombok.Data;
 
@Data
public class MgrSessionCountVO {
	private String sessionId;
	private Date creationTime; 
}