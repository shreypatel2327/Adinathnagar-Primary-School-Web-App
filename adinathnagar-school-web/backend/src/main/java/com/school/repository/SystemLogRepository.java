package com.school.repository;

import com.school.model.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLog, String> {

    @Query("SELECT l FROM SystemLog l LEFT JOIN FETCH l.user WHERE l.createdAt >= :from ORDER BY l.createdAt DESC")
    List<SystemLog> findByCreatedAtAfterOrderByCreatedAtDesc(@Param("from") LocalDateTime from);

    @Query("SELECT l FROM SystemLog l LEFT JOIN FETCH l.user ORDER BY l.createdAt DESC")
    List<SystemLog> findAllOrderByCreatedAtDesc();
}
