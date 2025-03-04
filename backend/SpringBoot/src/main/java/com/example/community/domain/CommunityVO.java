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
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

import com.example.member.domain.LoginVO;

import jakarta.persistence.SequenceGenerator;

@Data
@Entity
@Table(name = "COMMUNITY")
public class CommunityVO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "community_seq")
    @SequenceGenerator(name = "community_seq", sequenceName = "community_seq", allocationSize = 1)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private LoginVO user_num;

    @Column(name = "title", length = 300, nullable = false)
    private String title;

    @Column(name = "image_path", length = 1000, nullable = true)
    private String image_path;

    @Lob
    @Column(name = "contents", nullable = false)
    private String contents;

    @Column(name = "view_count")
    private Integer view_count = 0;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
    }

}
