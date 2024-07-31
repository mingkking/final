package com.example.community.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

import com.example.member.domain.LoginVO;


@Data
@Entity
@Table(name = "USERLIKE")
public class UserLikeVO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userlike_seq")
    @SequenceGenerator(name = "userlike_seq", sequenceName = "userlike_seq", allocationSize = 1)
    @Column(name = "like_num")
    private Integer like_num;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private LoginVO user_num;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private CommunityVO id;

}
