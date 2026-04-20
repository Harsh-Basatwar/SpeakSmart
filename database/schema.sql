-- ============================================================================
-- SpeakSmart English Learning Platform - MySQL Database Schema
-- ============================================================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS quiz_attempts;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS class_students;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_active TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- USER PROGRESS TABLE
-- ============================================================================
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_progress INT DEFAULT 0,
    completed_modules INT DEFAULT 0,
    flashcards_learned INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_progress (user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CLASSES TABLE
-- ============================================================================
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level ENUM('Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced') DEFAULT 'Beginner',
    teacher_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_teacher_id (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CLASS STUDENTS (Many-to-Many)
-- ============================================================================
CREATE TABLE class_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (class_id, student_id),
    INDEX idx_class_id (class_id),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- QUIZZES TABLE
-- ============================================================================
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    time_limit INT DEFAULT 300,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_difficulty (difficulty),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- QUIZ QUESTIONS TABLE
-- ============================================================================
CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question TEXT NOT NULL,
    type ENUM('multiple-choice', 'fill-blank', 'true-false') DEFAULT 'multiple-choice',
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- QUIZ ATTEMPTS TABLE
-- ============================================================================
CREATE TABLE quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FLASHCARDS TABLE
-- ============================================================================
CREATE TABLE flashcards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    meaning TEXT NOT NULL,
    example TEXT,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    pronunciation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_word (word)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@speaksmart.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin');

-- Insert sample flashcards
INSERT INTO flashcards (word, meaning, example, level) VALUES
('abundant', 'existing in large quantities', 'The forest has abundant wildlife.', 'intermediate'),
('achieve', 'to successfully complete or accomplish', 'She worked hard to achieve her goals.', 'beginner'),
('analyze', 'to examine in detail', 'Scientists analyze data to find patterns.', 'intermediate'),
('approach', 'to come near or closer to', 'The deadline is approaching quickly.', 'beginner'),
('benefit', 'an advantage or profit gained', 'Exercise has many health benefits.', 'beginner'),
('challenge', 'a difficult task or situation', 'Learning a new language is a challenge.', 'beginner'),
('collaborate', 'to work together with others', 'Teams collaborate to solve problems.', 'intermediate'),
('comprehensive', 'complete and including everything', 'The report provides comprehensive analysis.', 'advanced'),
('consequence', 'a result or effect of an action', 'Every decision has consequences.', 'intermediate'),
('demonstrate', 'to show clearly by example', 'The teacher will demonstrate the experiment.', 'intermediate'),
('efficient', 'working in a well-organized way', 'This method is more efficient than the old one.', 'intermediate'),
('enhance', 'to improve or increase', 'Music can enhance your mood.', 'intermediate'),
('establish', 'to set up or create', 'They plan to establish a new business.', 'intermediate'),
('evaluate', 'to judge or assess the value of', 'Teachers evaluate student performance.', 'intermediate'),
('fundamental', 'basic and essential', 'Reading is a fundamental skill.', 'advanced'),
('generate', 'to produce or create', 'Solar panels generate electricity.', 'intermediate'),
('implement', 'to put a plan into action', 'The company will implement new policies.', 'advanced'),
('indicate', 'to point out or show', 'The signs indicate the right direction.', 'intermediate'),
('influence', 'to have an effect on', 'Parents influence their children''s behavior.', 'intermediate'),
('maintain', 'to keep in good condition', 'Regular exercise helps maintain health.', 'beginner');

-- Insert sample quiz
INSERT INTO quizzes (title, description, difficulty, time_limit) VALUES
('Grammar Basics', 'Test your understanding of basic English grammar', 'Beginner', 300);

-- Insert sample quiz questions
INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES
(1, 'Which of the following is a correct sentence?', 'multiple-choice', 
 '["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She gone to school every day."]', 
 1, 1),
(1, 'Fill in the blank: "I _____ been waiting for an hour."', 'multiple-choice',
 '["have", "has", "had", "having"]',
 0, 2);

-- ============================================================================
-- USEFUL QUERIES FOR TESTING
-- ============================================================================

-- View all users with their progress
-- SELECT u.id, u.name, u.email, u.role, 
--        COALESCE(up.total_progress, 0) as progress,
--        COALESCE(up.completed_modules, 0) as modules
-- FROM users u
-- LEFT JOIN user_progress up ON u.id = up.user_id;

-- View classes with teacher names and student counts
-- SELECT c.id, c.name, c.level, 
--        u.name as teacher_name,
--        COUNT(cs.student_id) as student_count
-- FROM classes c
-- LEFT JOIN users u ON c.teacher_id = u.id
-- LEFT JOIN class_students cs ON c.id = cs.class_id
-- GROUP BY c.id;

-- View quiz with questions
-- SELECT q.id, q.title, q.difficulty,
--        COUNT(qq.id) as question_count
-- FROM quizzes q
-- LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
-- GROUP BY q.id;
