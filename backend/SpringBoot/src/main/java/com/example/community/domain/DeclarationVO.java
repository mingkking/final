package com.example.community.domain;

import jakarta.persistence.Column;
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

import java.time.LocalDateTime;

import com.example.member.domain.LoginVO;


@Data
@Entity
@Table(name = "DECLARATION")
public class DeclarationVO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "declaration_seq")
    @SequenceGenerator(name = "declaration_seq", sequenceName = "declaration_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private LoginVO user_num;

    @Column(name = "type", nullable = false, length = 16)
    private String type;

    @Column(name = "type_num", nullable = false)
    private Integer type_num;

    @Column(name = "content", nullable = false, length = 80)
    private String content;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
    }

}
