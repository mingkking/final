package com.example.member.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class PropertyVO {

	@JsonFormat(pattern = "yyyy-MM-dd")
	private String registration_date; 
	private Integer property_num; 
	private Long transaction_amount; 
	private String year_built; 
	private String address; 
	private String road_name; 
	private String apartment_name; 
	private Integer square_footage; 
	private String floor_number; 
	
}
