package com.example.member.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity 
@Table(name = "follow")
public class FollowVO {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "follow_seq")
    @SequenceGenerator(name = "follow_seq", sequenceName = "follow_seq", allocationSize = 1)
	private Integer id;
	
	@JoinColumn(name = "follower_id", referencedColumnName = "userNum", nullable = false)
	private Integer followerId;
	
	@JoinColumn(name = "followed_id", referencedColumnName = "userNum", nullable = false)
	private Integer followedId;
	
	private LocalDateTime createdAt;
	
	@PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
