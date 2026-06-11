package com.school.config;

import com.school.model.Student;
import com.school.model.User;
import com.school.repository.StudentRepository;
import com.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedStudents();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        // Admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setFullName("Admin - Adinathnagar School");
        admin.setIsActive(true);
        userRepository.save(admin);

        // Teacher user - Standard 1-5
        User teacher1 = new User();
        teacher1.setUsername("teacher1");
        teacher1.setPassword(passwordEncoder.encode("teacher123"));
        teacher1.setRole("TEACHER");
        teacher1.setFullName("Rameshbhai Patel");
        teacher1.setStandard("5");
        teacher1.setIsActive(true);
        userRepository.save(teacher1);

        // Teacher user - Standard 6-8
        User teacher2 = new User();
        teacher2.setUsername("teacher2");
        teacher2.setPassword(passwordEncoder.encode("teacher123"));
        teacher2.setRole("TEACHER");
        teacher2.setFullName("Sunitaben Shah");
        teacher2.setStandard("7");
        teacher2.setIsActive(true);
        userRepository.save(teacher2);

        System.out.println("✅ Users seeded: admin / admin123, teacher1 / teacher123");
    }

    private void seedStudents() {
        if (studentRepository.count() > 0) return;

        // Student 1
        Student s1 = new Student();
        s1.setGrNo(1001);
        s1.setFirstName("હર્ષિલ");
        s1.setMiddleName("રવિન્દ્રભાઈ");
        s1.setLastName("પટેલ");
        s1.setFullName("પટેલ હર્ષિલ રવિન્દ્રભાઈ");
        s1.setGender("Boy");
        s1.setDob(LocalDate.of(2014, 7, 18));
        s1.setStandard(5);
        s1.setCategory("OBC");
        s1.setAddress("રામનગર, નરોડા, અમદાવાદ");
        s1.setMobile("9898123456");
        s1.setBirthPlace("અમદાવાદ");
        s1.setCaste("OBC");
        s1.setOldSchoolGrNo("4521");
        s1.setNewSchoolGrNo("7893");
        s1.setPrevSchool("શ્રી સરસ્વતી પ્રાથમિક શાળા");
        s1.setFatherName("રવિન્દ્રભાઈ પટેલ");
        s1.setFatherEdu("ધોરણ 10");
        s1.setFatherOcc("ખેતી");
        s1.setMotherName("સોનલબેન પટેલ");
        s1.setMotherEdu("ધોરણ 8");
        s1.setMotherOcc("ગૃહિણી");
        s1.setAadhaarNo("456789123456");
        s1.setNameOnAadhaar("HARSHIL PATEL");
        s1.setUid("DISE-GJ-2024-0001");
        s1.setRationCard("RC-GJ-458796");
        s1.setBankAccount("456712345678");
        s1.setIfscCode("SBIN0001234");
        s1.setBankName("State Bank of India");
        s1.setBankHolderName("HARSHIL PATEL");
        s1.setAdmissionDate(LocalDate.of(2019, 6, 12));
        s1.setAcademicYear("2024-25");
        s1.setResult("પાસ");
        s1.setPercentage(76.5);
        s1.setAttendance(198.0);
        s1.setTransportation("Yes");
        s1.setIsHandicapped("No");
        s1.setStatus("Active");
        studentRepository.save(s1);

        // Student 2 (Balwatika = standard 0)
        Student s2 = new Student();
        s2.setGrNo(1002);
        s2.setFirstName("આરવ");
        s2.setMiddleName("નિલેશભાઈ");
        s2.setLastName("શાહ");
        s2.setFullName("શાહ આરવ નિલેશભાઈ");
        s2.setGender("Boy");
        s2.setDob(LocalDate.of(2019, 11, 5));
        s2.setStandard(0);
        s2.setCategory("GENERAL");
        s2.setAddress("ઘાટલોડિયા, અમદાવાદ");
        s2.setMobile("9876501234");
        s2.setBirthPlace("અમદાવાદ");
        s2.setCaste("GENERAL");
        s2.setFatherName("નિલેશભાઈ શાહ");
        s2.setFatherEdu("સ્નાતક");
        s2.setFatherOcc("વ્યવસાય");
        s2.setMotherName("રીટાબેન શાહ");
        s2.setMotherEdu("ધોરણ 12");
        s2.setMotherOcc("ગૃહિણી");
        s2.setAadhaarNo("123456789012");
        s2.setNameOnAadhaar("AARAV SHAH");
        s2.setUid("DISE-GJ-2024-0002");
        s2.setRationCard("RC-GJ-987654");
        s2.setAdmissionDate(LocalDate.of(2024, 6, 10));
        s2.setAcademicYear("2024-25");
        s2.setResult("પાસ");
        s2.setAttendance(120.0);
        s2.setTransportation("No");
        s2.setIsHandicapped("No");
        s2.setStatus("Active");
        studentRepository.save(s2);

        // Student 3
        Student s3 = new Student();
        s3.setGrNo(1003);
        s3.setFirstName("પ્રિયાંશી");
        s3.setMiddleName("મહેશભાઈ");
        s3.setLastName("વાઘેલા");
        s3.setFullName("વાઘેલા પ્રિયાંશી મહેશભાઈ");
        s3.setGender("Girl");
        s3.setDob(LocalDate.of(2011, 2, 22));
        s3.setStandard(8);
        s3.setCategory("SC");
        s3.setAddress("સેક્ટર 21, ગાંધીનગર");
        s3.setMobile("9825098765");
        s3.setBirthPlace("ગાંધીનગર");
        s3.setCaste("SC");
        s3.setOldSchoolGrNo("3345");
        s3.setNewSchoolGrNo("9981");
        s3.setPrevSchool("નવજીવન વિદ્યાલય");
        s3.setFatherName("મહેશભાઈ વાઘેલા");
        s3.setFatherEdu("ધોરણ 7");
        s3.setFatherOcc("મજૂરી");
        s3.setMotherName("કમલાબેન વાઘેલા");
        s3.setMotherEdu("અશિક્ષિત");
        s3.setMotherOcc("ગૃહિણી");
        s3.setAadhaarNo("789456123098");
        s3.setNameOnAadhaar("PRIYANSHI VAGHELA");
        s3.setUid("DISE-GJ-2024-0003");
        s3.setRationCard("RC-GJ-334455");
        s3.setBankAccount("998877665544");
        s3.setIfscCode("BKID0004567");
        s3.setBankName("Bank of India");
        s3.setBankHolderName("PRIYANSHI VAGHELA");
        s3.setAdmissionDate(LocalDate.of(2017, 6, 15));
        s3.setAcademicYear("2024-25");
        s3.setResult("પાસ");
        s3.setPercentage(61.2);
        s3.setAttendance(185.0);
        s3.setTransportation("Yes");
        s3.setIsHandicapped("Yes");
        s3.setHandicapPercentage(40.0);
        s3.setStatus("Active");
        studentRepository.save(s3);

        // Student 4 - Javak (transferred out)
        Student s4 = new Student();
        s4.setGrNo(1004);
        s4.setFirstName("ધ્રુવ");
        s4.setMiddleName("ભરતભાઈ");
        s4.setLastName("ચૌધરી");
        s4.setFullName("ચૌધરી ધ્રુવ ભરતભાઈ");
        s4.setGender("Boy");
        s4.setDob(LocalDate.of(2013, 5, 15));
        s4.setStandard(6);
        s4.setCategory("OBC");
        s4.setAddress("ઇસ્કોન, અમદાવાદ");
        s4.setMobile("9898001234");
        s4.setBirthPlace("અમદાવાદ");
        s4.setCaste("OBC");
        s4.setFatherName("ભરતભાઈ ચૌધરી");
        s4.setFatherEdu("ધોરણ 12");
        s4.setFatherOcc("નોકરી");
        s4.setMotherName("ભૂમિકા ચૌધરી");
        s4.setMotherEdu("ધોરણ 10");
        s4.setMotherOcc("ગૃહિણી");
        s4.setAadhaarNo("321654987012");
        s4.setNameOnAadhaar("DHRUV CHAUDHARY");
        s4.setUid("DISE-GJ-2024-0004");
        s4.setRationCard("RC-GJ-112233");
        s4.setAdmissionDate(LocalDate.of(2020, 6, 1));
        s4.setAcademicYear("2023-24");
        s4.setResult("Good");
        s4.setStatus("Javak");
        s4.setLeavingDate(LocalDate.of(2024, 3, 15));
        s4.setDestinationSchool("ભારત વિદ્યાલય, સુરત");
        s4.setRemarks("Family shifted to Surat");
        studentRepository.save(s4);

        // Students 5-12 (one per standard for demo)
        String[][] names = {
            {"1005", "Girl", "2", "જાનવી", "સુરેશભાઈ", "ભટ્ટ", "ભટ્ટ જાનવી સુરેશભાઈ", "9876500011"},
            {"1006", "Boy", "3", "આર્ય", "દિપકકુમાર", "જોષી", "જોષી આર્ય દિપકકુમાર", "9876500022"},
            {"1007", "Girl", "4", "ક્ષિપ્રા", "મનોજભાઈ", "દેસાઈ", "દેસાઈ ક્ષિપ્રા મનોજભાઈ", "9876500033"},
            {"1008", "Boy", "6", "નીલ", "કિરણભાઈ", "પ્રજાપતિ", "પ્રજાપતિ નીલ કિરણભાઈ", "9876500044"},
            {"1009", "Girl", "7", "સ્નેહા", "રઘુભાઈ", "સોલંકી", "સોલંકી સ્નેહા રઘુભાઈ", "9876500055"},
            {"1010", "Boy", "1", "ઋત્વિક", "મહેન્દ્રભાઈ", "રાઠોડ", "રાઠોડ ઋત્વિક મહેન્દ્રભાઈ", "9876500066"},
        };

        String[] castes = {"GENERAL", "OBC", "SC", "ST", "OBC", "GENERAL"};

        for (int i = 0; i < names.length; i++) {
            String[] n = names[i];
            Student s = new Student();
            s.setGrNo(Integer.parseInt(n[0]));
            s.setGender(n[1]);
            s.setStandard(Integer.parseInt(n[2]));
            s.setFirstName(n[3]);
            s.setMiddleName(n[4]);
            s.setLastName(n[5]);
            s.setFullName(n[6]);
            s.setMobile(n[7]);
            s.setBirthPlace("અમદાવાદ");
            s.setCaste(castes[i]);
            s.setCategory(castes[i]);
            s.setAddress("અમદાવાદ, ગુજરાત");
            s.setFatherName("પિતા " + n[5]);
            s.setFatherEdu("ધોરણ 10");
            s.setFatherOcc("ખેતી");
            s.setMotherName("માતા " + n[5]);
            s.setMotherEdu("ધોરણ 8");
            s.setMotherOcc("ગૃહિણી");
            s.setUid("DISE-GJ-2024-000" + (i + 5));
            s.setAadhaarNo("00000000" + (1000 + i));
            s.setNameOnAadhaar(n[3].toUpperCase() + " " + n[5].toUpperCase());
            s.setRationCard("RC-GJ-00000" + (i + 5));
            s.setAdmissionDate(LocalDate.of(2020 + i % 4, 6, 10));
            s.setAcademicYear("2024-25");
            s.setResult("Good");
            s.setAttendance(180.0 + i);
            s.setTransportation("No");
            s.setIsHandicapped("No");
            s.setDob(LocalDate.of(2012 + i % 6, 3 + i % 10, 10 + i % 15));
            s.setStatus("Active");
            studentRepository.save(s);
        }

        System.out.println("✅ Students seeded: 12 students (10 Active, 1 Javak, 1 Balwatika)");
    }
}
