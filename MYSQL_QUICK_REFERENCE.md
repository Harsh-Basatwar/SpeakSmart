# MySQL Quick Reference Card
## SpeakSmart Platform

---

## 🚀 Quick Setup (5 Minutes)

```bash
# 1. Install MySQL & Workbench
# Download: https://dev.mysql.com/downloads/

# 2. Create database in MySQL Workbench
CREATE DATABASE english_learning_platform;
USE english_learning_platform;
SOURCE /path/to/database/schema.sql;

# 3. Configure .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=english_learning_platform

# 4. Install & test
cd server
npm install mysql2
node test-db.js

# 5. Start server
npm run dev
```

---

## 📝 Common SQL Queries

### View All Users
```sql
SELECT id, name, email, role, created_at 
FROM users 
ORDER BY created_at DESC;
```

### View Students with Progress
```sql
SELECT u.name, u.email, 
       up.total_progress, 
       up.completed_modules
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.role = 'student';
```

### View Quiz with Questions
```sql
SELECT q.title, q.difficulty,
       COUNT(qq.id) as question_count
FROM quizzes q
LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
GROUP BY q.id;
```

### View Class Enrollments
```sql
SELECT c.name as class_name,
       u.name as teacher_name,
       COUNT(cs.student_id) as student_count
FROM classes c
LEFT JOIN users u ON c.teacher_id = u.id
LEFT JOIN class_students cs ON c.id = cs.class_id
GROUP BY c.id;
```

### View Quiz Attempts
```sql
SELECT u.name, q.title, qa.score, qa.completed_at
FROM quiz_attempts qa
JOIN users u ON qa.user_id = u.id
JOIN quizzes q ON qa.quiz_id = q.id
ORDER BY qa.completed_at DESC
LIMIT 10;
```

---

## 🔧 Maintenance Commands

### Backup Database
```bash
mysqldump -u root -p english_learning_platform > backup.sql
```

### Restore Database
```bash
mysql -u root -p english_learning_platform < backup.sql
```

### Check Table Sizes
```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'english_learning_platform'
ORDER BY (data_length + index_length) DESC;
```

### Optimize Tables
```sql
OPTIMIZE TABLE users, quizzes, flashcards;
```

### View Active Connections
```sql
SHOW PROCESSLIST;
```

---

## 🐛 Troubleshooting

### Reset Root Password
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Check MySQL Status
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl status mysql
```

### View Error Log
```bash
# Linux
tail -f /var/log/mysql/error.log

# Windows
# Check: C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
```

### Test Connection
```bash
mysql -u root -p -h localhost
```

---

## 📊 Useful Queries for Development

### Create Test Student
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Test Student', 'test@example.com', '$2a$12$...', 'student');

INSERT INTO user_progress (user_id) 
VALUES (LAST_INSERT_ID());
```

### Create Test Quiz
```sql
INSERT INTO quizzes (title, description, difficulty, time_limit) 
VALUES ('Test Quiz', 'Sample quiz', 'Beginner', 300);

INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index)
VALUES (LAST_INSERT_ID(), 'Sample question?', 'multiple-choice', 
        '["Option A", "Option B", "Option C", "Option D"]', 1, 0);
```

### Delete All Test Data
```sql
DELETE FROM users WHERE email LIKE '%test%';
DELETE FROM quizzes WHERE title LIKE '%test%';
```

### Reset Auto Increment
```sql
ALTER TABLE users AUTO_INCREMENT = 1;
```

---

## 🔐 Security Best Practices

### Create App User (Not Root)
```sql
CREATE USER 'speaksmart_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON english_learning_platform.* 
TO 'speaksmart_app'@'localhost';
FLUSH PRIVILEGES;
```

### View User Permissions
```sql
SHOW GRANTS FOR 'speaksmart_app'@'localhost';
```

### Revoke Permissions
```sql
REVOKE ALL PRIVILEGES ON english_learning_platform.* 
FROM 'speaksmart_app'@'localhost';
```

---

## 📈 Performance Monitoring

### Show Slow Queries
```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SHOW VARIABLES LIKE 'slow_query_log%';
```

### Analyze Query Performance
```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### Show Index Usage
```sql
SHOW INDEX FROM users;
```

### Connection Stats
```sql
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
SHOW VARIABLES LIKE 'max_connections';
```

---

## 🎯 Model Usage Examples

### User Model
```javascript
const { User } = require('./models');

// Find all students
const students = await User.findAll('student');

// Find by email
const user = await User.findByEmail('test@example.com');

// Create user
const newUser = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: hashedPassword,
  role: 'student'
});

// Update user
await User.update(userId, { name: 'Jane Doe' });

// Delete user
await User.delete(userId);
```

### Quiz Model
```javascript
const { Quiz } = require('./models');

// Get all quizzes
const quizzes = await Quiz.findAll();

// Create quiz
const quiz = await Quiz.create({
  title: 'Grammar Test',
  description: 'Test your grammar',
  difficulty: 'Intermediate',
  timeLimit: 600,
  questions: [...]
}, teacherId);

// Record attempt
await Quiz.recordAttempt(userId, quizId, score, totalQuestions, timeTaken);
```

### Progress Model
```javascript
const { Progress } = require('./models');

// Get progress
const progress = await Progress.get(userId);

// Update progress
await Progress.update(userId, {
  total_progress: 75,
  completed_modules: 15,
  flashcards_learned: 50,
  streak_days: 7
});

// Reset progress
await Progress.reset(userId);
```

---

## 📞 Quick Help

| Issue | Command |
|-------|---------|
| Can't connect | `mysql -u root -p` |
| Wrong database | `USE english_learning_platform;` |
| Missing tables | `SOURCE database/schema.sql;` |
| Test connection | `node server/test-db.js` |
| View logs | Check MySQL error log |
| Reset password | `ALTER USER ... IDENTIFIED BY ...` |

---

## 🔗 Useful Links

- **MySQL Docs**: https://dev.mysql.com/doc/
- **mysql2 Package**: https://www.npmjs.com/package/mysql2
- **SQL Tutorial**: https://www.w3schools.com/sql/
- **Full Setup Guide**: See `MYSQL_SETUP_GUIDE.md`

---

**💡 Tip**: Bookmark this file for quick reference during development!
