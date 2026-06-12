# Adinathnagar Primary School — Web Management Application

A complete, premium school management web application designed for Adinathnagar Primary School. Built with a robust **Spring Boot** backend, secure **MySQL** database, and a dynamic **React** (Vite + Vanilla CSS) frontend using state-of-the-art Glassmorphic designs.

---

## 🌟 Resume Quick-Copy Section (Remove Before Uploading to GitHub)

If you are putting this project on your resume, here is a professional, high-impact description you can use:

### **Adinathnagar Primary School Management System** | *Full Stack Java Developer*
*   **Architecture & Security**: Engineered a secure RESTful API system using **Spring Boot 3** and **Spring Security (JWT)** to enforce rigid Role-Based Access Control (RBAC) separating administrative actions from standard teachers.
*   **Data Scoping**: Architected SQL query scopes and standard-filtering JPA repositories to restrict teachers' read/write capabilities solely to their assigned class records, eliminating data leaks across class standards.
*   **Docker Orchestration**: Configured multi-stage **Dockerfiles** and a unified **Docker Compose** layout containerizing a MySQL 8 database, the Java backend api, and Nginx-based React asset hosting to support zero-configuration deployments.
*   **Custom Printing Engine**: Developed an A4 portrait scaling layout engine in **CSS (@media print)** to solve cross-browser print dialog alignment issues, centering and sizing Vali Form and Bonafide certificates dynamically.
*   **Interactive UI Engine**: Designed a premium responsive frontend in **React** featuring custom sliding notification popups (Toast system), dynamic dark/light mode switches, and drawer navigation drawers adapting to mobile and desktop displays.

---

## 🚀 Key Features

*   **Role-Based Separation (Admin vs. Teacher)**:
    *   **Principal (Admin)**: Has full authorization to add/edit teachers, inspect system log audit activity, view Aavak/Javak registers, and generate student certificates.
    *   **Class Teacher**: Locked down exclusively to view, add, and update students within their assigned class standard. Access to registers, logs, deletion operations, and certificates is strictly blocked.
*   **Interactive Dashboard**: Real-time filtered student counters, active quick-task grid triggers, and recent administrative audit activity lists (for Admins).
*   **Dynamic Theme System**: Sleek premium dark mode by default, easily swappable with a toggle button to a Light mode with high-contrast text color mappings.
*   **Custom Toast Popups**: Slide-in animated notifications replacing browser warnings on successful creations, updates, or API errors.
*   **Clean Printable Layouts**: Centered, standard Vali Form and Bonafide certificates calibrated to print cleanly on A4 pages.
*   **Full Device Responsiveness**: Drawer menus, column reflows, and adaptive flex layouts allowing management from tablets and smartphones.

---

## 🛠️ Technology Stack

*   **Backend**: Spring Boot 3, Spring Security, JWT (JSON Web Tokens), Spring Data JPA, Hibernate ORM, MySQL 8.
*   **Frontend**: React (Vite + JavaScript), Axios, Lucide Icons, Vanilla CSS (tokens system).
*   **Deployment**: Docker, Nginx, Docker Compose.

---

## 💻 Local Setup Instructions

### 1. Prerequisites
*   Java JDK 17 or higher
*   Node.js 18 or higher
*   MySQL Server running on localhost (default DB name: `schoolwebapp`, user: `root`, password: `TIGER`)

### 2. Run Backend
1. Create a database named `schoolwebapp` in your MySQL database.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will boot up on port `9995` and automatically seed initial data.*

### 3. Run Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application will start on port `5173`. Open your browser to `http://localhost:5173`.*

---

## 🐳 Docker Deployment Instructions

To run the entire ecosystem (MySQL, Spring Boot API, React client) with a single command, use Docker Compose:

1. Ensure Docker Desktop is installed and running.
2. Run the build command in the root folder (where `docker-compose.yml` is located):
   ```bash
   docker-compose up --build
   ```
3. Access services:
   *   **Frontend Webapp**: `http://localhost:5173`
   *   **Backend API**: `http://localhost:9995/api`
   *   **MySQL Server**: Port `3306` on localhost

*All MySQL records are persistent and saved in the Docker volume `mysql_data`.*
