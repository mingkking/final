package com.example.news.domain;
 
import java.util.Date;

import lombok.Data;
  
@Data
public class NewsVO {
	private int id;
	private String title;
	private String url;
	private String published_at;
	private String category;
	private String imgs;
}