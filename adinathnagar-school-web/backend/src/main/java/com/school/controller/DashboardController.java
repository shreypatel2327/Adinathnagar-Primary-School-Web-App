package com.school.controller;

import com.school.model.User;
import com.school.repository.StudentRepository;
import com.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        boolean isTeacher = user != null && "TEACHER".equalsIgnoreCase(user.getRole());

        long totalStudents;
        long javakCount;
        long aavakCount;

        if (isTeacher) {
            Integer std = 0;
            if (user.getStandard() != null) {
                try {
                    if ("Balwatika".equalsIgnoreCase(user.getStandard())) std = 0;
                    else std = Integer.parseInt(user.getStandard());
                } catch (NumberFormatException ignored) {}
            }
            totalStudents = studentRepository.countByStatusAndStandard("Active", std);
            javakCount = studentRepository.countByStatusAndStandard("Javak", std);
            aavakCount = totalStudents + javakCount;
        } else {
            totalStudents = studentRepository.countByStatus("Active");
            javakCount = studentRepository.countByStatus("Javak");
            aavakCount = studentRepository.count();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("standardCount", isTeacher ? (user.getStandard().equals("0") || "Balwatika".equalsIgnoreCase(user.getStandard()) ? "Balwatika" : user.getStandard()) : "1-8");
        stats.put("javakCount", javakCount);
        stats.put("aavakCount", aavakCount);

        return ResponseEntity.ok(stats);
    }
}
