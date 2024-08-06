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
@Table(name = "REREPLY")
public class ReReplyVO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rereply_seq")
    @SequenceGenerator(name = "rereply_seq", sequenceName = "rereply_seq", allocationSize = 1)
    @Column(name = "rereply_num")
    private Integer rereply_num;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private LoginVO user_num;

    @ManyToOne
    @JoinColumn(name = "reply_num", nullable = false)
    private ReplyVO reply_num;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
    }

}
