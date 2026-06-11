package com.school.controller;

import com.school.model.Student;
import com.school.model.SystemLog;
import com.school.model.User;
import com.school.repository.StudentRepository;
import com.school.repository.SystemLogRepository;
import com.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemLogRepository logRepository;

    // GET /api/students
    @GetMapping("/students")
    public ResponseEntity<?> getStudents(@RequestParam(required = false) String search) {
        List<Student> students;
        if (search != null && !search.isEmpty()) {
            students = studentRepository.searchActiveStudents(search);
        } else {
            students = studentRepository.findByStatusOrderByGrNoAsc("Active");
        }
        return ResponseEntity.ok(studentsToMapList(students));
    }

    // POST /api/students
    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            // Auto-generate GR No
            int nextGrNo = studentRepository.findMaxGrNo().orElse(1000) + 1;

            Student student = mapToStudent(body, new Student());
            student.setGrNo(nextGrNo);
            student.setStatus("Active");

            Student saved = studentRepository.save(student);
            logAction(auth, "CREATE", saved.getFullName(), "Added Student: " + saved.getFullName() + " (GR: " + saved.getGrNo() + ")");

            return ResponseEntity.ok(studentToMap(saved));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create student: " + e.getMessage()));
        }
    }

    // GET /api/students/{id}
    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable String id) {
        return studentRepository.findById(id)
            .map(s -> ResponseEntity.ok(studentToMap(s)))
            .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/students/{id}
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        return studentRepository.findById(id).map(student -> {
            mapToStudent(body, student);
            Student saved = studentRepository.save(student);
            logAction(auth, "UPDATE", saved.getFullName(), "Edited Student: " + saved.getFullName());
            return ResponseEntity.ok(studentToMap(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/students/{id}
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id, Authentication auth) {
        return studentRepository.findById(id).map(student -> {
            String name = student.getFullName();
            studentRepository.delete(student);
            logAction(auth, "DELETE", name, "Deleted Student: " + name);
            return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/students/{id}/javak
    @PatchMapping("/students/{id}/javak")
    public ResponseEntity<?> markAsJavak(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        return studentRepository.findById(id).map(student -> {
            student.setStatus("Javak");
            student.setDestinationSchool((String) body.get("destinationSchool"));
            student.setRemarks((String) body.get("remarks"));
            String leavingDateStr = (String) body.get("leavingDate");
            if (leavingDateStr != null) {
                student.setLeavingDate(LocalDate.parse(leavingDateStr.substring(0, 10)));
            }
            Student saved = studentRepository.save(student);
            logAction(auth, "UPDATE", saved.getFullName(), "Marked as Javak: " + saved.getFullName() + " → " + saved.getDestinationSchool());
            return ResponseEntity.ok(studentToMap(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/javak-register
    @GetMapping("/javak-register")
    public ResponseEntity<?> getJavakStudents() {
        List<Student> students = studentRepository.findByStatusOrderByGrNoAsc("Javak");
        return ResponseEntity.ok(studentsToMapList(students));
    }

    // GET /api/aavak-register
    @GetMapping("/aavak-register")
    public ResponseEntity<?> getAavakStudents() {
        // All active students sorted by admission date
        List<Student> students = studentRepository.findAll();
        students.sort(Comparator.comparing(s -> s.getAdmissionDate() != null ? s.getAdmissionDate() : LocalDate.MIN));
        return ResponseEntity.ok(studentsToMapList(students));
    }

    // Helper: map request body to Student entity
    private Student mapToStudent(Map<String, Object> body, Student student) {
        if (body.containsKey("fullName")) student.setFullName((String) body.get("fullName"));
        if (body.containsKey("firstName")) student.setFirstName((String) body.get("firstName"));
        if (body.containsKey("middleName")) student.setMiddleName((String) body.get("middleName"));
        if (body.containsKey("lastName")) student.setLastName((String) body.get("lastName"));
        if (body.containsKey("gender")) student.setGender((String) body.get("gender"));
        if (body.containsKey("standard")) {
            Object std = body.get("standard");
            if (std != null) student.setStandard(Integer.parseInt(std.toString()));
        }
        if (body.containsKey("category")) student.setCategory((String) body.get("category"));
        if (body.containsKey("caste")) student.setCaste((String) body.get("caste"));
        if (body.containsKey("address")) student.setAddress((String) body.get("address"));
        if (body.containsKey("mobile")) student.setMobile((String) body.get("mobile"));
        if (body.containsKey("birthPlace")) student.setBirthPlace((String) body.get("birthPlace"));
        if (body.containsKey("dob")) {
            String dob = (String) body.get("dob");
            if (dob != null && !dob.isEmpty()) student.setDob(LocalDate.parse(dob.substring(0, 10)));
        }
        if (body.containsKey("oldSchoolGrNo")) student.setOldSchoolGrNo((String) body.get("oldSchoolGrNo"));
        if (body.containsKey("newSchoolGrNo")) student.setNewSchoolGrNo((String) body.get("newSchoolGrNo"));
        if (body.containsKey("prevSchool")) student.setPrevSchool((String) body.get("prevSchool"));
        if (body.containsKey("fatherName")) student.setFatherName((String) body.get("fatherName"));
        if (body.containsKey("fatherEdu")) student.setFatherEdu((String) body.get("fatherEdu"));
        if (body.containsKey("fatherOcc")) student.setFatherOcc((String) body.get("fatherOcc"));
        if (body.containsKey("fatherAadhaar")) student.setFatherAadhaar((String) body.get("fatherAadhaar"));
        if (body.containsKey("fatherNameOnAadhaar")) student.setFatherNameOnAadhaar((String) body.get("fatherNameOnAadhaar"));
        if (body.containsKey("motherName")) student.setMotherName((String) body.get("motherName"));
        if (body.containsKey("motherEdu")) student.setMotherEdu((String) body.get("motherEdu"));
        if (body.containsKey("motherOcc")) student.setMotherOcc((String) body.get("motherOcc"));
        if (body.containsKey("motherAadhaar")) student.setMotherAadhaar((String) body.get("motherAadhaar"));
        if (body.containsKey("uid")) student.setUid((String) body.get("uid"));
        if (body.containsKey("aadhaarNo")) student.setAadhaarNo((String) body.get("aadhaarNo"));
        if (body.containsKey("nameOnAadhaar")) student.setNameOnAadhaar((String) body.get("nameOnAadhaar"));
        if (body.containsKey("rationCard")) student.setRationCard((String) body.get("rationCard"));
        if (body.containsKey("bankAccount")) student.setBankAccount((String) body.get("bankAccount"));
        if (body.containsKey("ifscCode")) student.setIfscCode((String) body.get("ifscCode"));
        if (body.containsKey("bankName")) student.setBankName((String) body.get("bankName"));
        if (body.containsKey("bankHolderName")) student.setBankHolderName((String) body.get("bankHolderName"));
        if (body.containsKey("admissionDate")) {
            String ad = (String) body.get("admissionDate");
            if (ad != null && !ad.isEmpty()) student.setAdmissionDate(LocalDate.parse(ad.substring(0, 10)));
        }
        if (body.containsKey("academicYear")) student.setAcademicYear((String) body.get("academicYear"));
        if (body.containsKey("result")) student.setResult((String) body.get("result"));
        if (body.containsKey("percentage") && body.get("percentage") != null) {
            student.setPercentage(Double.parseDouble(body.get("percentage").toString()));
        }
        if (body.containsKey("attendance") && body.get("attendance") != null) {
            student.setAttendance(Double.parseDouble(body.get("attendance").toString()));
        }
        if (body.containsKey("transportation")) student.setTransportation((String) body.get("transportation"));
        if (body.containsKey("isHandicapped")) student.setIsHandicapped((String) body.get("isHandicapped"));
        if (body.containsKey("handicapPercentage") && body.get("handicapPercentage") != null) {
            student.setHandicapPercentage(Double.parseDouble(body.get("handicapPercentage").toString()));
        }
        return student;
    }

    private Map<String, Object> studentToMap(Student s) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", s.getId());
        map.put("grNo", s.getGrNo());
        map.put("firstName", s.getFirstName());
        map.put("middleName", s.getMiddleName());
        map.put("lastName", s.getLastName());
        map.put("fullName", s.getFullName());
        map.put("gender", s.getGender());
        map.put("dob", s.getDob() != null ? s.getDob().toString() : null);
        map.put("standard", s.getStandard());
        map.put("category", s.getCategory());
        map.put("caste", s.getCaste());
        map.put("address", s.getAddress());
        map.put("mobile", s.getMobile());
        map.put("birthPlace", s.getBirthPlace());
        map.put("oldSchoolGrNo", s.getOldSchoolGrNo());
        map.put("newSchoolGrNo", s.getNewSchoolGrNo());
        map.put("prevSchool", s.getPrevSchool());
        map.put("fatherName", s.getFatherName());
        map.put("fatherEdu", s.getFatherEdu());
        map.put("fatherOcc", s.getFatherOcc());
        map.put("fatherAadhaar", s.getFatherAadhaar());
        map.put("fatherNameOnAadhaar", s.getFatherNameOnAadhaar());
        map.put("motherName", s.getMotherName());
        map.put("motherEdu", s.getMotherEdu());
        map.put("motherOcc", s.getMotherOcc());
        map.put("motherAadhaar", s.getMotherAadhaar());
        map.put("aadhaarNo", s.getAadhaarNo());
        map.put("nameOnAadhaar", s.getNameOnAadhaar());
        map.put("uid", s.getUid());
        map.put("rationCard", s.getRationCard());
        map.put("bankAccount", s.getBankAccount());
        map.put("ifscCode", s.getIfscCode());
        map.put("bankName", s.getBankName());
        map.put("bankHolderName", s.getBankHolderName());
        map.put("admissionDate", s.getAdmissionDate() != null ? s.getAdmissionDate().toString() : null);
        map.put("academicYear", s.getAcademicYear());
        map.put("result", s.getResult());
        map.put("percentage", s.getPercentage());
        map.put("attendance", s.getAttendance());
        map.put("transportation", s.getTransportation());
        map.put("isHandicapped", s.getIsHandicapped());
        map.put("handicapPercentage", s.getHandicapPercentage());
        map.put("status", s.getStatus());
        map.put("leavingDate", s.getLeavingDate() != null ? s.getLeavingDate().toString() : null);
        map.put("destinationSchool", s.getDestinationSchool());
        map.put("remarks", s.getRemarks());
        map.put("createdAt", s.getCreatedAt() != null ? s.getCreatedAt().toString() : null);
        return map;
    }

    private List<Map<String, Object>> studentsToMapList(List<Student> students) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Student s : students) list.add(studentToMap(s));
        return list;
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
