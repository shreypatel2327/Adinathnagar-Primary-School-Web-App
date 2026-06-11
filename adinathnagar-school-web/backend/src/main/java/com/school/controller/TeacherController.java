package com.school.controller;

import com.school.model.User;
import com.school.model.SystemLog;
import com.school.repository.StudentRepository;
import com.school.repository.SystemLogRepository;
import com.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemLogRepository logRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET /api/teachers
    @GetMapping
    public ResponseEntity<?> getTeachers(@RequestParam(required = false) String search) {
        List<User> teachers = userRepository.findAll().stream()
            .filter(u -> "TEACHER".equals(u.getRole()))
            .filter(u -> {
                if (search == null || search.isEmpty()) return true;
                String s = search.toLowerCase();
                return (u.getFullName() != null && u.getFullName().toLowerCase().contains(s)) ||
                       u.getUsername().toLowerCase().contains(s);
            })
            .toList();

        List<Map<String, Object>> result = teachers.stream().map(this::userToMap).toList();
        return ResponseEntity.ok(result);
    }

    // POST /api/teachers
    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, Object> body, Authentication auth) {
        String username = (String) body.get("username");
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        User teacher = new User();
        teacher.setUsername(username);
        teacher.setPassword(passwordEncoder.encode((String) body.getOrDefault("password", "teacher123")));
        teacher.setRole("TEACHER");
        teacher.setFullName((String) body.get("fullName"));
        teacher.setStandard((String) body.get("standard"));
        teacher.setIsActive(true);

        User saved = userRepository.save(teacher);
        logAction(auth, "CREATE", saved.getFullName(), "Added Teacher: " + saved.getFullName());
        return ResponseEntity.ok(userToMap(saved));
    }

    // PUT /api/teachers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        return userRepository.findById(id).map(teacher -> {
            if (body.containsKey("fullName")) teacher.setFullName((String) body.get("fullName"));
            if (body.containsKey("standard")) teacher.setStandard((String) body.get("standard"));
            if (body.containsKey("isActive")) teacher.setIsActive((Boolean) body.get("isActive"));
            if (body.containsKey("password") && body.get("password") != null && !((String) body.get("password")).isEmpty()) {
                teacher.setPassword(passwordEncoder.encode((String) body.get("password")));
            }
            User saved = userRepository.save(teacher);
            logAction(auth, "UPDATE", saved.getFullName(), "Updated Teacher: " + saved.getFullName());
            return ResponseEntity.ok(userToMap(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> userToMap(User u) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", u.getId());
        map.put("username", u.getUsername());
        map.put("role", u.getRole());
        map.put("fullName", u.getFullName());
        map.put("standard", u.getStandard());
        map.put("isActive", u.getIsActive());
        map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
        return map;
    }

    private void logAction(Authentication auth, String actionType, String title, String description) {
        if (auth == null) return;
        try {
            userRepository.findByUsername(auth.getName()).ifPresent(user -> {
                SystemLog log = new SystemLog();
                log.setUser(user);
                log.setActionType(actionType);
                log.setTitle(title);
                log.setDescription(description);
                logRepository.save(log);
            });
        } catch (Exception ignored) {}
    }
}
