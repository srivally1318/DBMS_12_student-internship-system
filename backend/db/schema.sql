-- Database Schema for Student Internship Management System

CREATE DATABASE IF NOT EXISTS sims_db;
USE sims_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments/Applications Table
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE enrollments
ADD CONSTRAINT unique_user_course UNIQUE(user_id, course_name);

-- Insert Sample Users
INSERT INTO users (name, email, password) VALUES 
('Alice Smith', 'alice@example.com', 'password123'),
('Bob Jones', 'bob@example.com', 'mypassword'),
('Charlie Brown', 'charlie@example.com', 'securepass');

-- Insert Sample Enrollments (Internship Applications)
INSERT INTO enrollments (user_id, course_name, phone) VALUES 
(1, 'Software Engineering Intern', '555-1234'),
(1, 'UX/UI Design Intern', '555-1234'),
(2, 'Data Science Intern', '555-5678'),
(3, 'Cybersecurity Intern', '555-9012'),
(3, 'Digital Marketing Intern', '555-9012');
