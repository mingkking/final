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
@Table(name = "BOOKMARK")
public class BookmarkVO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bookmark_seq")
    @SequenceGenerator(name = "bookmark_seq", sequenceName = "bookmark_seq", allocationSize = 1)
    @Column(name = "book_num")
    private Integer book_num;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private LoginVO user_num;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private CommunityVO id;

}
