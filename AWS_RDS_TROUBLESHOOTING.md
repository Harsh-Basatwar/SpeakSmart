# AWS RDS Troubleshooting Guide
## Complete Error Resolution Reference

---

## 🔍 Quick Diagnosis

### Step 1: Identify the Error Category

| Error Message Contains | Category | Jump To |
|------------------------|----------|---------|
| "ETIMEDOUT", "ECONNREFUSED" | Network | [Network Issues](#network-issues) |
| "Access denied", "ER_ACCESS_DENIED" | Authentication | [Auth Issues](#authentication-issues) |
| "Unknown database", "ER_BAD_DB" | Database | [Database Issues](#database-issues) |
| "Too many connections" | Connection Pool | [Connection Issues](#connection-pool-issues) |
| "SSL", "certificate" | SSL/TLS | [SSL Issues](#ssltls-issues) |
| "Timeout", "Query timeout" | Performance | [Performance Issues](#performance-issues) |

---

## 🌐 Network Issues

### Error: "connect ETIMEDOUT"

**Full Error:**
```
Error: connect ETIMEDOUT
    at TCPConnectWrap.afterConnect [as oncomplete]
```

**Cause:** Cannot reach RDS instance

**Solutions:**

#### 1. Check Security Group

```bash
# Go to AWS Console
RDS → Your DB → Connectivity & security → Security groups

# Verify inbound rules
Type: MySQL/Aurora
Port: 3306
Source: Your IP address
```

**Fix:**
```
1. Click on security group
2. Edit inbound rules
3. Add rule:
   - Type: MySQL/Aurora
   - Source: My IP
4. Save rules
```

#### 2. Verify Your IP Address

```bash
# Check your current IP
curl ifconfig.me

# Or visit
https://whatismyipaddress.com/
```

**Note:** If your IP changed, update security group!

#### 3. Check RDS Status

```bash
# In RDS Console
Status should be: "Available"

If "Stopped" → Start the instance
If "Modifying" → Wait for completion
If "Failed" → Check CloudWatch logs
```

#### 4. Test with Telnet

```bash
# Windows
telnet speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com 3306

# If telnet not installed
Test-NetConnection -ComputerName speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com -Port 3306

# Linux/Mac
telnet speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com 3306
```

**Expected:** Connection established
**If fails:** Network/firewall issue

---

### Error: "ECONNREFUSED"

**Full Error:**
```
Error: connect ECONNREFUSED
```

**Cause:** Connection actively refused

**Solutions:**

#### 1. Verify Endpoint

```bash
# Check endpoint in RDS Console
RDS → Your DB → Connectivity & security → Endpoint

# Should look like:
speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com

# NOT like:
localhost
127.0.0.1
```

#### 2. Check Port

```env
# In .env file
DB_PORT=3306  # NOT 3305, 3307, etc.
```

#### 3. Verify Public Access

```bash
# RDS Console → Your DB → Connectivity & security
Publicly accessible: Yes

# If "No" and you need external access:
1. Modify DB instance
2. Set "Publicly accessible" to Yes
3. Apply immediately
```

---

## 🔐 Authentication Issues

### Error: "Access denied for user"

**Full Error:**
```
ER_ACCESS_DENIED_ERROR: Access denied for user 'admin'@'xxx.xxx.xxx.xxx' (using password: YES)
```

**Cause:** Wrong username or password

**Solutions:**

#### 1. Verify Credentials

```env
# Check .env file
DB_USER=admin  # Default RDS username
DB_PASSWORD=your_actual_password  # No quotes, no spaces

# Common mistakes:
❌ DB_PASSWORD="password"  # Remove quotes
❌ DB_PASSWORD=password   # Extra space at end
✅ DB_PASSWORD=password123  # Correct
```

#### 2. Reset Master Password

```bash
# In RDS Console
1. Select your DB instance
2. Click "Modify"
3. Scroll to "Settings"
4. Enter new master password
5. Confirm password
6. Click "Continue"
7. Select "Apply immediately"
8. Click "Modify DB instance"

# Wait 5 minutes for change to apply
# Update .env with new password
```

#### 3. Check User Exists

```sql
-- Connect as master user
mysql -h your-endpoint.rds.amazonaws.com -u admin -p

-- List all users
SELECT User, Host FROM mysql.user;

-- If user missing, create it
CREATE USER 'admin'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON english_learning_platform.* TO 'admin'@'%';
FLUSH PRIVILEGES;
```

#### 4. Verify Host Permissions

```sql
-- Check user permissions
SHOW GRANTS FOR 'admin'@'%';

-- Should see:
GRANT ALL PRIVILEGES ON `english_learning_platform`.* TO `admin`@`%`

-- If not, grant permissions:
GRANT ALL PRIVILEGES ON english_learning_platform.* TO 'admin'@'%';
FLUSH PRIVILEGES;
```

---

## 🗄️ Database Issues

### Error: "Unknown database"

**Full Error:**
```
ER_BAD_DB_ERROR: Unknown database 'english_learning_platform'
```

**Cause:** Database doesn't exist

**Solutions:**

#### 1. Create Database

```sql
-- Connect without database name
mysql -h your-endpoint.rds.amazonaws.com -u admin -p

-- Create database
CREATE DATABASE english_learning_platform 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;
```

#### 2. Import Schema

```bash
# Method 1: MySQL Workbench
1. Connect to RDS
2. File → Run SQL Script
3. Select database/schema.sql
4. Execute

# Method 2: Command line
mysql -h your-endpoint.rds.amazonaws.com -u admin -p english_learning_platform < database/schema.sql
```

#### 3. Verify Database Name

```env
# In .env file
DB_NAME=english_learning_platform  # Exact match, case-sensitive

# Check in MySQL
SHOW DATABASES LIKE 'english%';
```

---

### Error: "Table doesn't exist"

**Full Error:**
```
ER_NO_SUCH_TABLE: Table 'english_learning_platform.users' doesn't exist
```

**Cause:** Schema not imported

**Solutions:**

#### 1. Check Tables

```sql
USE english_learning_platform;
SHOW TABLES;

-- Should show 8 tables:
-- users, user_progress, classes, class_students
-- quizzes, quiz_questions, quiz_attempts, flashcards
```

#### 2. Import Schema

```bash
# Re-import schema
mysql -h your-endpoint.rds.amazonaws.com -u admin -p english_learning_platform < database/schema.sql

# Verify
mysql -h your-endpoint.rds.amazonaws.com -u admin -p -e "USE english_learning_platform; SHOW TABLES;"
```

---

## 🔌 Connection Pool Issues

### Error: "Too many connections"

**Full Error:**
```
ER_TOO_MANY_USER_CONNECTIONS: User 'admin' has exceeded the 'max_user_connections' resource
ER_CON_COUNT_ERROR: Too many connections
```

**Cause:** Connection pool exhausted

**Solutions:**

#### 1. Increase Pool Limit

```env
# In .env file
DB_CONNECTION_LIMIT=20  # Increase from 10
DB_QUEUE_LIMIT=0  # Unlimited queue
```

```javascript
// In config/database.js
const pool = mysql.createPool({
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
});
```

#### 2. Check for Connection Leaks

```javascript
// ❌ Bad: Connection not released
async function badQuery() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM users');
  return rows; // Connection never released!
}

// ✅ Good: Connection properly released
async function goodQuery() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  } finally {
    connection.release(); // Always release
  }
}

// ✅ Better: Use promisePool.execute()
async function bestQuery() {
  const [rows] = await promisePool.execute('SELECT * FROM users');
  return rows; // Auto-released
}
```

#### 3. Monitor Active Connections

```sql
-- Check current connections
SHOW PROCESSLIST;

-- Count connections by user
SELECT user, COUNT(*) as connections 
FROM information_schema.processlist 
GROUP BY user;

-- Kill stuck connections
KILL <process_id>;
```

#### 4. Upgrade RDS Instance

```bash
# If consistently hitting limits
1. RDS Console → Modify
2. Choose larger instance class
   - db.t3.small (2 GB RAM, ~150 connections)
   - db.t3.medium (4 GB RAM, ~300 connections)
3. Apply immediately
```

---

## 🔒 SSL/TLS Issues

### Error: "self signed certificate"

**Full Error:**
```
Error: self signed certificate in certificate chain
```

**Cause:** SSL certificate validation failed

**Solutions:**

#### 1. Disable SSL (Development Only)

```env
# In .env file
DB_SSL=false
```

```javascript
// In config/database.js
const sslConfig = process.env.DB_SSL === 'true' ? {
  rejectUnauthorized: true
} : false;
```

#### 2. Download RDS Certificate (Production)

```bash
# Download AWS RDS CA bundle
curl -o rds-ca-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

# Move to server directory
mv rds-ca-bundle.pem server/config/
```

```javascript
// Update config/database.js
const fs = require('fs');
const path = require('path');

const sslConfig = process.env.DB_SSL === 'true' ? {
  ca: fs.readFileSync(path.join(__dirname, 'rds-ca-bundle.pem')),
  rejectUnauthorized: true
} : false;
```

#### 3. Verify SSL Connection

```sql
-- Connect and check SSL status
mysql -h your-endpoint.rds.amazonaws.com -u admin -p --ssl-mode=REQUIRED

-- Check SSL status
SHOW STATUS LIKE 'Ssl_cipher';

-- Should show cipher name, not empty
```

---

## ⚡ Performance Issues

### Error: "Query timeout"

**Full Error:**
```
Error: Query timeout
Error: Lock wait timeout exceeded
```

**Cause:** Slow queries or locks

**Solutions:**

#### 1. Increase Timeout

```javascript
// In config/database.js
const pool = mysql.createPool({
  connectTimeout: 60000,  // 60 seconds
  acquireTimeout: 60000,
  timeout: 60000
});
```

#### 2. Identify Slow Queries

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- Queries > 2 seconds

-- View slow queries
SELECT * FROM mysql.slow_log 
ORDER BY query_time DESC 
LIMIT 10;
```

#### 3. Optimize Queries

```sql
-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Add missing indexes
CREATE INDEX idx_email ON users(email);

-- Update statistics
ANALYZE TABLE users;
```

#### 4. Check for Locks

```sql
-- View locked tables
SHOW OPEN TABLES WHERE In_use > 0;

-- View running queries
SHOW FULL PROCESSLIST;

-- Kill long-running query
KILL <process_id>;
```

---

## 💾 Storage Issues

### Error: "Disk full"

**Full Error:**
```
ERROR 1114 (HY000): The table is full
```

**Cause:** Storage space exhausted

**Solutions:**

#### 1. Check Storage

```bash
# RDS Console → Your DB → Monitoring
# Check "Free Storage Space"

# Or query
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
```

#### 2. Enable Autoscaling

```bash
# RDS Console → Modify
1. Storage autoscaling: Enable
2. Maximum storage threshold: 100 GB
3. Apply immediately
```

#### 3. Increase Storage

```bash
# RDS Console → Modify
1. Allocated storage: Increase (e.g., 20 GB → 50 GB)
2. Apply immediately
3. Wait for modification to complete
```

#### 4. Clean Up Data

```sql
-- Delete old quiz attempts
DELETE FROM quiz_attempts 
WHERE completed_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Optimize tables
OPTIMIZE TABLE quiz_attempts;
```

---

## 🔧 Configuration Issues

### Error: "max_allowed_packet"

**Full Error:**
```
ER_NET_PACKET_TOO_LARGE: Got a packet bigger than 'max_allowed_packet' bytes
```

**Cause:** Query or result too large

**Solutions:**

#### 1. Increase Packet Size

```bash
# Create custom parameter group
1. RDS Console → Parameter groups → Create
2. Name: speaksmart-params
3. Family: mysql8.0

# Modify parameter
1. Select parameter group
2. Edit parameters
3. Find: max_allowed_packet
4. Value: 67108864 (64MB)
5. Save changes

# Apply to DB
1. RDS → Modify
2. DB parameter group: speaksmart-params
3. Apply immediately
4. Reboot instance
```

#### 2. Split Large Queries

```javascript
// ❌ Bad: Insert 1000 rows at once
INSERT INTO flashcards VALUES (...), (...), ... // 1000 rows

// ✅ Good: Batch insert
const batchSize = 100;
for (let i = 0; i < data.length; i += batchSize) {
  const batch = data.slice(i, i + batchSize);
  await insertBatch(batch);
}
```

---

## 📊 Monitoring & Debugging

### Enable Detailed Logging

```javascript
// In config/database.js
const pool = mysql.createPool({
  // ... other config
  debug: process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : false
});

// Log all queries
pool.on('connection', (connection) => {
  console.log('New connection established');
});

pool.on('acquire', (connection) => {
  console.log('Connection acquired from pool');
});

pool.on('release', (connection) => {
  console.log('Connection released back to pool');
});
```

### Check CloudWatch Logs

```bash
# AWS Console
CloudWatch → Log groups → /aws/rds/instance/speaksmart-db/error

# Look for:
- Connection errors
- Authentication failures
- Slow queries
- Deadlocks
```

### Test Connection Programmatically

```javascript
// server/test-rds-connection.js
const { promisePool } = require('./config/database');

async function testRDS() {
  console.log('Testing RDS connection...\n');
  
  try {
    // Test 1: Basic query
    const [result] = await promisePool.query('SELECT 1 + 1 AS result');
    console.log('✅ Basic query:', result[0].result);
    
    // Test 2: Database
    const [db] = await promisePool.query('SELECT DATABASE() as db');
    console.log('✅ Database:', db[0].db);
    
    // Test 3: Tables
    const [tables] = await promisePool.query('SHOW TABLES');
    console.log('✅ Tables:', tables.length);
    
    // Test 4: SSL
    const [ssl] = await promisePool.query("SHOW STATUS LIKE 'Ssl_cipher'");
    console.log('✅ SSL:', ssl[0].Value || 'Not enabled');
    
    // Test 5: Connection count
    const [conns] = await promisePool.query('SHOW STATUS LIKE "Threads_connected"');
    console.log('✅ Active connections:', conns[0].Value);
    
    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nDetails:', error);
  }
  
  process.exit(0);
}

testRDS();
```

---

## 🆘 Emergency Procedures

### Complete Connection Failure

```bash
# 1. Verify RDS is running
aws rds describe-db-instances --db-instance-identifier speaksmart-db

# 2. Check security group
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# 3. Test from different network
# Try mobile hotspot or different WiFi

# 4. Rollback to local database
# Update .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=local_password

# Restart server
npm run dev
```

### Data Corruption

```bash
# 1. Stop application
# 2. Restore from snapshot
RDS Console → Snapshots → Select latest → Restore

# 3. Point application to restored instance
# Update .env with new endpoint

# 4. Verify data integrity
mysql -h new-endpoint.rds.amazonaws.com -u admin -p
SELECT COUNT(*) FROM users;
```

### Performance Degradation

```bash
# 1. Check CloudWatch metrics
# CPU, Memory, Connections, IOPS

# 2. Identify slow queries
# Performance Insights → Top SQL

# 3. Scale up temporarily
RDS → Modify → Larger instance class → Apply immediately

# 4. Optimize after stabilization
# Add indexes, optimize queries
```

---

## 📞 Getting Help

### AWS Support

```
Free tier: Community forums
Developer: $29/month
Business: $100/month
Enterprise: $15,000/month
```

### Useful Resources

- **AWS RDS Docs**: https://docs.aws.amazon.com/rds/
- **MySQL Docs**: https://dev.mysql.com/doc/
- **Stack Overflow**: Tag `amazon-rds` + `mysql`
- **AWS Forums**: https://forums.aws.amazon.com/forum.jspa?forumID=60

### Diagnostic Information to Provide

```bash
# When asking for help, include:

1. Error message (full stack trace)
2. RDS instance details
   - Instance class
   - MySQL version
   - Region
3. Security group rules
4. Connection string (hide password!)
5. Application logs
6. CloudWatch metrics screenshot
7. What you've tried already
```

---

## ✅ Prevention Checklist

- [ ] Security groups properly configured
- [ ] Credentials stored securely
- [ ] SSL/TLS enabled
- [ ] Automated backups enabled
- [ ] CloudWatch alarms set up
- [ ] Connection pooling configured
- [ ] Queries optimized with indexes
- [ ] Regular monitoring in place
- [ ] Disaster recovery plan documented
- [ ] Team trained on procedures

---

**Remember**: Most issues are network or authentication related. Start there!
