package com.school.repository;

import com.school.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, String> {

    List<Student> findByStatusOrderByGrNoAsc(String status);

    @Query("SELECT s FROM Student s WHERE s.status = 'Active' AND " +
           "(LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "CONCAT(s.grNo, '') LIKE CONCAT('%', :query, '%') OR " +
           "s.mobile LIKE CONCAT('%', :query, '%'))")
    List<Student> searchActiveStudents(@Param("query") String query);

    Optional<Student> findByGrNo(Integer grNo);

    boolean existsByGrNo(Integer grNo);

    @Query("SELECT MAX(s.grNo) FROM Student s")
    Optional<Integer> findMaxGrNo();

    long countByStatus(String status);

    long countByStatusAndStandard(String status, Integer standard);
}
