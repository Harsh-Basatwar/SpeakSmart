# MySQL Database Integration Guide
## SpeakSmart English Learning Platform

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [MySQL Installation & Setup](#mysql-installation--setup)
3. [Database Configuration](#database-configuration)
4. [Project Setup](#project-setup)
5. [Database Schema Creation](#database-schema-creation)
6. [Testing the Connection](#testing-the-connection)
7. [Optimizations & Best Practices](#optimizations--best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software:
- **Node.js** v14+ (https://nodejs.org/)
- **MySQL Server** 8.0+ (https://dev.mysql.com/downloads/mysql/)
- **MySQL Workbench** (https://dev.mysql.com/downloads/workbench/)
- **Git** (optional, for version control)

---

## 2. MySQL Installation & Setup

### Windows:

1. **Download MySQL Installer**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download: `mysql-installer-community-8.x.x.msi`

2. **Run Installer**
   - Choose "Developer Default" or "Server only"
   - Set root password (remember this!)
   - Default port: 3306
   - Configure as Windows Service (auto-start)

3. **Install MySQL Workbench**
   - Included in Developer Default
   - Or download separately: https://dev.mysql.com/downloads/workbench/

### macOS:

```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Secure installation
mysql_secure_installation
```

### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

---

## 3. Database Configuration

### Step 1: Open MySQL Workbench

1. Launch MySQL Workbench
2. Click on "Local instance MySQL80" (or your connection)
3. Enter your root password

### Step 2: Create Database

```sql
CREATE DATABASE english_learning_platform 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE english_learning_platform;
```

### Step 3: Run Schema Script

1. In MySQL Workbench, go to **File → Open SQL Script**
2. Navigate to: `database/schema.sql`
3. Click **Execute** (⚡ icon) or press `Ctrl+Shift+Enter`
4. Verify tables created:

```sql
SHOW TABLES;
```

You should see:
- users
- user_progress
- classes
- class_students
- quizzes
- quiz_questions
- quiz_attempts
- flashcards

### Step 4: Verify Seed Data

```sql
-- Check admin user
SELECT * FROM users WHERE role = 'admin';

-- Check flashcards
SELECT COUNT(*) FROM flashcards;

-- Check sample quiz
SELECT * FROM quizzes;
```

---

## 4. Project Setup

### Step 1: Install Dependencies

```bash
# Navigate to server directory
cd server

# Install mysql2 driver
npm install mysql2

# Or install all dependencies
npm install
```

### Step 2: Configure Environment Variables

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=english_learning_platform
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

**⚠️ IMPORTANT:** Replace `your_mysql_password_here` with your actual MySQL root password!

### Step 3: Test Database Connection

Create a test file `server/test-db.js`:

```javascript
require('dotenv').config();
const { promisePool } = require('./config/database');

async function testConnection() {
  try {
    const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
    console.log('✅ Database connected! Test query result:', rows[0].result);
    
    const [users] = await promisePool.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users table accessible. Count:', users[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run test:

```bash
node test-db.js
```

---

## 5. Database Schema Creation

### Tables Overview:

#### **users**
- Stores all users (students, teachers, admins)
- Passwords hashed with bcrypt
- Indexed on email and role

#### **user_progress**
- Tracks student learning progress
- One-to-one with users (students only)
- Auto-created on student signup

#### **classes**
- Manages class/course information
- Links to teacher via foreign key
- Supports multiple levels

#### **class_students**
- Many-to-many relationship
- Links students to classes
- Tracks enrollment date

#### **quizzes**
- Quiz metadata (title, difficulty, time limit)
- Links to creator (teacher)

#### **quiz_questions**
- Individual quiz questions
- JSON field for options
- Ordered by order_index

#### **quiz_attempts**
- Records student quiz submissions
- Tracks score and time taken
- Used for analytics

#### **flashcards**
- Vocabulary learning cards
- Categorized by level
- Searchable by word

---

## 6. Testing the Connection

### Start the Server

```bash
cd server
npm run dev
```

Expected output:
```
✅ MySQL Connected Successfully
🚀 Server running on port 5000
📚 English Learning Platform API
🌐 Environment: development
```

### Test API Endpoints

#### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

#### 2. Create Test User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@test.com",
    "password": "password123",
    "role": "student"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'
```

#### 4. Get Flashcards
```bash
curl http://localhost:5000/api/flashcards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 7. Optimizations & Best Practices

### Connection Pooling
✅ **Already Implemented** in `config/database.js`

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,  // Max 10 concurrent connections
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true
});
```

### Prepared Statements
✅ **Already Implemented** - All queries use `promisePool.execute()` with parameterized queries

**Benefits:**
- Prevents SQL injection
- Better performance (query plan caching)
- Automatic escaping

### Indexes
✅ **Already Created** in schema:

```sql
-- Email lookup (login)
INDEX idx_email (email)

-- Role filtering
INDEX idx_role (role)

-- Foreign key lookups
INDEX idx_user_id (user_id)
INDEX idx_quiz_id (quiz_id)
```

### Query Optimization Tips:

1. **Use SELECT specific columns** instead of `SELECT *`
   ```javascript
   // ✅ Good
   SELECT id, name, email FROM users
   
   // ❌ Avoid
   SELECT * FROM users
   ```

2. **Limit result sets**
   ```javascript
   // Get recent 10 quiz attempts
   SELECT * FROM quiz_attempts 
   WHERE user_id = ? 
   ORDER BY completed_at DESC 
   LIMIT 10
   ```

3. **Use JOINs efficiently**
   ```javascript
   // ✅ Single query with JOIN
   SELECT u.*, up.total_progress 
   FROM users u 
   LEFT JOIN user_progress up ON u.id = up.user_id
   
   // ❌ Multiple queries
   // SELECT * FROM users
   // SELECT * FROM user_progress WHERE user_id = ?
   ```

4. **Batch inserts**
   ```javascript
   // ✅ Single query
   INSERT INTO flashcards (word, meaning) VALUES 
   ('word1', 'meaning1'),
   ('word2', 'meaning2'),
   ('word3', 'meaning3');
   ```

### Caching Strategy

Consider implementing Redis for:
- Session management
- Frequently accessed data (flashcards, quizzes)
- Rate limiting

### Backup Strategy

```bash
# Daily backup script
mysqldump -u root -p english_learning_platform > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p english_learning_platform < backup_20240101.sql
```

---

## 8. Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Reset MySQL root password
mysql -u root

ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

Update `.env` with new password.

---

### Issue: "ER_NOT_SUPPORTED_AUTH_MODE"

**Solution:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

---

### Issue: "Can't connect to MySQL server on 'localhost'"

**Solutions:**

1. **Check if MySQL is running:**
   ```bash
   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo systemctl status mysql
   ```

2. **Check port:**
   ```bash
   netstat -an | findstr 3306
   ```

3. **Verify firewall settings**

---

### Issue: "Table doesn't exist"

**Solution:**
```sql
-- Check current database
SELECT DATABASE();

-- Switch to correct database
USE english_learning_platform;

-- Verify tables
SHOW TABLES;
```

---

### Issue: Connection pool timeout

**Solution:**
Increase pool size in `config/database.js`:

```javascript
const pool = mysql.createPool({
  connectionLimit: 20,  // Increase from 10
  queueLimit: 0
});
```

---

### Issue: Slow queries

**Solution:**

1. **Enable slow query log:**
   ```sql
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 2;
   ```

2. **Analyze queries:**
   ```sql
   EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
   ```

3. **Add missing indexes:**
   ```sql
   CREATE INDEX idx_column_name ON table_name(column_name);
   ```

---

## 9. Migration from JSON to MySQL

If you have existing JSON data:

### Step 1: Export JSON Data

```javascript
// server/scripts/export-json.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database');
const users = JSON.parse(fs.readFileSync(path.join(dbPath, 'users.json'), 'utf8'));

console.log(JSON.stringify(users, null, 2));
```

### Step 2: Import to MySQL

```javascript
// server/scripts/import-to-mysql.js
const { promisePool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function importData() {
  const dbPath = path.join(__dirname, '../../database');
  const users = JSON.parse(fs.readFileSync(path.join(dbPath, 'users.json'), 'utf8'));

  for (const user of users) {
    await promisePool.execute(
      'INSERT INTO users (id, name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, user.password, user.role, user.createdAt]
    );
  }

  console.log('✅ Data imported successfully');
}

importData();
```

---

## 10. Performance Monitoring

### Query Performance

```sql
-- Show slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;

-- Show table sizes
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'english_learning_platform'
ORDER BY (data_length + index_length) DESC;
```

### Connection Monitoring

```sql
-- Show active connections
SHOW PROCESSLIST;

-- Show connection stats
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
```

---

## 11. Security Checklist

- ✅ Use environment variables for credentials
- ✅ Never commit `.env` to version control
- ✅ Use prepared statements (prevents SQL injection)
- ✅ Hash passwords with bcrypt
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Regular backups
- ✅ Principle of least privilege (create separate DB users)

### Create Limited User

```sql
-- Create app user with limited permissions
CREATE USER 'speaksmart_app'@'localhost' IDENTIFIED BY 'secure_password';

GRANT SELECT, INSERT, UPDATE, DELETE ON english_learning_platform.* 
TO 'speaksmart_app'@'localhost';

FLUSH PRIVILEGES;
```

Update `.env`:
```env
DB_USER=speaksmart_app
DB_PASSWORD=secure_password
```

---

## 12. Production Deployment

### Environment Variables

```env
NODE_ENV=production
DB_HOST=your-production-db-host.com
DB_PORT=3306
DB_NAME=english_learning_platform
DB_USER=production_user
DB_PASSWORD=strong_production_password
JWT_SECRET=very-long-random-secret-key
```

### SSL/TLS Connection

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  ssl: {
    ca: fs.readFileSync('/path/to/ca-cert.pem')
  }
});
```

---

## 📞 Support

For issues or questions:
1. Check MySQL error logs: `/var/log/mysql/error.log`
2. Check application logs
3. Review this guide's troubleshooting section
4. MySQL Documentation: https://dev.mysql.com/doc/

---

## ✅ Quick Start Checklist

- [ ] MySQL Server installed and running
- [ ] MySQL Workbench installed
- [ ] Database created: `english_learning_platform`
- [ ] Schema script executed: `database/schema.sql`
- [ ] `.env` file configured with correct credentials
- [ ] Dependencies installed: `npm install`
- [ ] Connection test passed: `node test-db.js`
- [ ] Server starts successfully: `npm run dev`
- [ ] API endpoints responding
- [ ] Frontend connects to backend

---

**🎉 Congratulations! Your MySQL database is now integrated with SpeakSmart!**
