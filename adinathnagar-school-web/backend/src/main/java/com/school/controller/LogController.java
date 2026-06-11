package com.school.controller;

import com.school.model.SystemLog;
import com.school.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    @Autowired
    private SystemLogRepository logRepository;

    @GetMapping
    public ResponseEntity<?> getLogs(
            @RequestParam(defaultValue = "Today") String period,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action) {

        LocalDateTime from;
        LocalDateTime now = LocalDateTime.now();

        switch (period) {
            case "This Week" -> from = now.minusDays(7);
            case "Month" -> from = now.minusDays(30);
            default -> from = now.toLocalDate().atStartOfDay();
        }

        List<SystemLog> logs = logRepository.findByCreatedAtAfterOrderByCreatedAtDesc(from);

        // Filter by action
        if (action != null && !action.isEmpty()) {
            logs = logs.stream()
                .filter(l -> l.getActionType().equalsIgnoreCase(action))
                .toList();
        }

        // Filter by search (user name or description)
        if (search != null && !search.isEmpty()) {
            String s = search.toLowerCase();
            logs = logs.stream()
                .filter(l -> l.getTitle().toLowerCase().contains(s) ||
                             l.getDescription().toLowerCase().contains(s))
                .toList();
        }

        List<Map<String, Object>> result = logs.stream().map(this::logToMap).toList();
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> logToMap(SystemLog log) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", log.getId());
        map.put("actionType", log.getActionType());
        map.put("title", log.getTitle());
        map.put("description", log.getDescription());
        map.put("createdAt", log.getCreatedAt() != null ? log.getCreatedAt().toString() : null);

        if (log.getUser() != null) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", log.getUser().getId());
            userMap.put("username", log.getUser().getUsername());
            userMap.put("fullName", log.getUser().getFullName());
            map.put("user", userMap);
        }
        return map;
    }
}
