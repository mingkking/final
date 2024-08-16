package com.example.community.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

import com.example.member.domain.LoginVO;


@Data
@Entity
@Table(name = "REPLY")
public class ReplyVO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reply_seq")
    @SequenceGenerator(name = "reply_seq", sequenceName = "reply_seq", allocationSize = 1)
    @Column(name = "reply_num")
    private Integer reply_num;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private LoginVO user_num;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private CommunityVO id;

    @Lob
    @Column(name = "contents", nullable = false)
    private String contents;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
    }

}
