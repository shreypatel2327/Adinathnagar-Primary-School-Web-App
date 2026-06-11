package com.school.controller;

import com.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalStudents = studentRepository.countByStatus("Active");
        long javakCount = studentRepository.countByStatus("Javak");
        long aavakCount = studentRepository.count(); // All admitted ever

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("standardCount", "1-8");
        stats.put("javakCount", javakCount);
        stats.put("aavakCount", aavakCount);

        return ResponseEntity.ok(stats);
    }
}
