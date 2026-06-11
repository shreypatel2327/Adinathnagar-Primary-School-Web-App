package com.school.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String actionType; // CREATE, UPDATE, DELETE, EXPORT, SYSTEM

    @Column(nullable = false)
    private String title; // e.g., "Ramesh Patel"

    @Column(nullable = false, length = 1000)
    private String description; // e.g., "Edited Student: Rahul"

    @CreationTimestamp
    private LocalDateTime createdAt;
}
