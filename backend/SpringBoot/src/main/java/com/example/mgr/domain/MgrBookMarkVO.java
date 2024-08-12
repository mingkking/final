package com.example.mgr.domain;
 
import java.util.Date; 

import lombok.Data;
 
@Data   
public class MgrBookMarkVO {
    private String user_num;
    private String title;
    private String contents;
    private int view_count;
    private String id;
} 