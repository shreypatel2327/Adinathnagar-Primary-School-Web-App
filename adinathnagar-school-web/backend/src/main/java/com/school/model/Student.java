package com.school.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private Integer grNo;

    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName;

    @Column(nullable = false)
    private String gender; // Boy, Girl, કુમાર, કન્યા

    private LocalDate dob;

    @Column(nullable = false)
    private Integer standard; // 0=Balwatika, 1-8

    private String category;
    private String address;

    // Admission Control
    private String oldSchoolGrNo;
    private String newSchoolGrNo;
    private String dietNo;
    private String prevSchool;

    // Personal
    private String mobile;
    private String birthPlace;
    private String caste; // GENERAL, OBC, SC, ST

    // Family
    private String fatherName;
    private String fatherEdu;
    private String fatherOcc;
    private String fatherAadhaar;
    private String fatherNameOnAadhaar;

    private String motherName;
    private String motherEdu;
    private String motherOcc;
    private String motherAadhaar;

    // Govt
    private String aadhaarNo;
    private String nameOnAadhaar;
    private String uid; // Student DISE
    private String rationCard;
    private String birthCertName;
    private String birthCertNo;

    // Bank
    private String bankAccount;
    private String ifscCode;
    private String bankName;
    private String bankHolderName;

    // Academic
    private LocalDate admissionDate;
    private String academicYear;
    private String result;
    private Double percentage;
    private Double attendance;

    // Social
    private String transportation; // Yes/No
    private String isHandicapped; // Yes/No
    private Double handicapPercentage;

    // Javak / Exit
    @Column(nullable = false)
    private String status = "Active"; // Active, Javak

    private LocalDate leavingDate;
    private String destinationSchool;
    private String remarks;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Certificate> certificates;
}
