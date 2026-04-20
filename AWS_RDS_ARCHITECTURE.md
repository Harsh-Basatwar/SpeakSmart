# AWS RDS Architecture Diagram

```
═══════════════════════════════════════════════════════════════════════════
                        AWS CLOUD DEPLOYMENT ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────────────┐
│                         YOUR COMPUTER                                    │
│                      (Development Machine)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐         ┌─────────────────┐                       │
│  │  React Frontend │         │  MySQL Workbench│                       │
│  │  localhost:3000 │         │  (Management)   │                       │
│  └────────┬────────┘         └────────┬────────┘                       │
│           │                            │                                 │
│           │ API Calls                  │ SQL Queries                     │
│           │                            │                                 │
│  ┌────────▼────────────────────────────▼────────┐                       │
│  │         Node.js/Express Server               │                       │
│  │           localhost:5000                     │                       │
│  │  • JWT Authentication                        │                       │
│  │  • Connection Pooling                        │                       │
│  │  • SSL/TLS Enabled                           │                       │
│  └──────────────────┬───────────────────────────┘                       │
└────────────────────┼────────────────────────────────────────────────────┘
                     │
                     │ MySQL Protocol (Port 3306)
                     │ SSL/TLS Encrypted
                     │
┌────────────────────▼────────────────────────────────────────────────────┐
│                           AWS CLOUD                                      │
│                        (us-east-1 Region)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      SECURITY GROUP                                │  │
│  │                   (speaksmart-db-sg)                               │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │  Inbound Rules:                                                    │  │
│  │  • Type: MySQL/Aurora                                              │  │
│  │  • Port: 3306                                                      │  │
│  │  • Source: Your IP (xxx.xxx.xxx.xxx/32)                           │  │
│  │  • Protocol: TCP                                                   │  │
│  └───────────────────────────┬───────────────────────────────────────┘  │
│                              │                                            │
│  ┌───────────────────────────▼───────────────────────────────────────┐  │
│  │                      VPC (Virtual Private Cloud)                   │  │
│  │                         Default VPC                                │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │              AVAILABILITY ZONE (us-east-1a)                  │  │  │
│  │  ├─────────────────────────────────────────────────────────────┤  │  │
│  │  │                                                              │  │  │
│  │  │  ┌────────────────────────────────────────────────────────┐ │  │  │
│  │  │  │           RDS MySQL Instance                           │ │  │  │
│  │  │  │        (speaksmart-db.xxxxxxxxxx.rds.amazonaws.com)    │ │  │  │
│  │  │  ├────────────────────────────────────────────────────────┤ │  │  │
│  │  │  │                                                         │ │  │  │
│  │  │  │  Instance Class: db.t3.micro                           │ │  │  │
│  │  │  │  Engine: MySQL 8.0.35                                  │ │  │  │
│  │  │  │  Storage: 20 GB (SSD)                                  │ │  │  │
│  │  │  │  Multi-AZ: No (Single AZ)                              │ │  │  │
│  │  │  │  Public Access: Yes                                    │ │  │  │
│  │  │  │  Encryption: Enabled                                   │ │  │  │
│  │  │  │                                                         │ │  │  │
│  │  │  │  ┌──────────────────────────────────────────────────┐ │ │  │  │
│  │  │  │  │         Database: english_learning_platform      │ │ │  │  │
│  │  │  │  ├──────────────────────────────────────────────────┤ │ │  │  │
│  │  │  │  │  Tables:                                          │ │ │  │  │
│  │  │  │  │  • users                                          │ │ │  │  │
│  │  │  │  │  • user_progress                                  │ │ │  │  │
│  │  │  │  │  • classes                                        │ │ │  │  │
│  │  │  │  │  • class_students                                 │ │ │  │  │
│  │  │  │  │  • quizzes                                        │ │ │  │  │
│  │  │  │  │  • quiz_questions                                 │ │ │  │  │
│  │  │  │  │  • quiz_attempts                                  │ │ │  │  │
│  │  │  │  │  • flashcards                                     │ │ │  │  │
│  │  │  │  └──────────────────────────────────────────────────┘ │ │  │  │
│  │  │  │                                                         │ │  │  │
│  │  │  └─────────────────────────────────────────────────────────┘ │  │  │
│  │  │                                                              │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    AUTOMATED BACKUPS                               │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │  • Retention: 7 days                                               │  │
│  │  • Backup Window: 03:00-04:00 UTC                                  │  │
│  │  • Point-in-time Recovery: Enabled                                 │  │
│  │  • Stored in: Amazon S3 (encrypted)                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    CLOUDWATCH MONITORING                           │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │  Metrics:                                                          │  │
│  │  • CPU Utilization                                                 │  │
│  │  • Database Connections                                            │  │
│  │  • Free Storage Space                                              │  │
│  │  • Read/Write Latency                                              │  │
│  │  • Network Throughput                                              │  │
│  │                                                                     │  │
│  │  Alarms:                                                           │  │
│  │  • CPU > 80% → SNS Notification                                    │  │
│  │  • Storage < 20% → SNS Notification                                │  │
│  │  • Connections > 80 → SNS Notification                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                        PRODUCTION ARCHITECTURE (OPTIONAL)
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────────────┐
│                      ROUTE 53 (DNS)                                      │
│                   speaksmart.com                                         │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────────┐
│                   CLOUDFRONT (CDN)                                       │
│                   • SSL/TLS Certificate                                  │
│                   • DDoS Protection                                      │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────────┐
│              APPLICATION LOAD BALANCER (ALB)                             │
│              • Health Checks                                             │
│              • Auto Scaling                                              │
└──────────────┬──────────────────────────┬──────────────────────────────┘
               │                          │
       ┌───────▼────────┐        ┌───────▼────────┐
       │   EC2 Instance │        │   EC2 Instance │
       │   (App Server) │        │   (App Server) │
       │   us-east-1a   │        │   us-east-1b   │
       └───────┬────────┘        └───────┬────────┘
               │                          │
               └──────────┬───────────────┘
                          │
                          │ Private Subnet
                          │
       ┌──────────────────▼──────────────────┐
       │                                      │
┌──────▼──────┐                    ┌─────────▼──────┐
│  RDS Master │◄──────Replication──┤  RDS Read      │
│  (Primary)  │                    │  Replica       │
│  us-east-1a │                    │  us-east-1b    │
└─────────────┘                    └────────────────┘
       │
       │ Automated Failover
       │
┌──────▼──────┐
│  RDS Standby│
│  (Multi-AZ) │
│  us-east-1b │
└─────────────┘


═══════════════════════════════════════════════════════════════════════════
                            DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════════════

1. USER SIGNUP REQUEST
   ┌─────────────────────────────────────────────────────────────────┐
   │ Client → POST /api/auth/signup                                   │
   │ { name, email, password, role }                                  │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Server: Hash password (bcrypt)                                   │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Model: User.create()                                             │
   │ • Get connection from pool                                       │
   │ • Execute prepared statement                                     │
   │ • INSERT INTO users (name, email, password, role)                │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ AWS RDS: Process query                                           │
   │ • Validate constraints                                           │
   │ • Write to storage                                               │
   │ • Update indexes                                                 │
   │ • Return insertId                                                │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Server: Generate JWT token                                       │
   │ • Sign with secret                                               │
   │ • Set expiry (7 days)                                            │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Response: { token, user }                                        │
   │ Client stores token in localStorage                              │
   └─────────────────────────────────────────────────────────────────┘


2. AUTHENTICATED REQUEST (Get Flashcards)
   ┌─────────────────────────────────────────────────────────────────┐
   │ Client → GET /api/flashcards                                     │
   │ Headers: { Authorization: "Bearer <token>" }                     │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Middleware: authenticateToken                                    │
   │ • Verify JWT signature                                           │
   │ • Check expiry                                                   │
   │ • Extract user info                                              │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Route: routes/flashcards.js                                      │
   │ • Call Flashcard.findAll()                                       │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Model: Flashcard.findAll()                                       │
   │ • Get connection from pool                                       │
   │ • Execute: SELECT * FROM flashcards ORDER BY word                │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ AWS RDS: Execute query                                           │
   │ • Use index on 'word' column                                     │
   │ • Fetch from cache if available                                  │
   │ • Return result set                                              │
   └────────────────────────┬────────────────────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────────────────────┐
   │ Response: [{ id, word, meaning, example, level }, ...]           │
   │ Client displays flashcards                                       │
   └─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                        SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════════

Layer 1: Network Security
  ├─ Security Group (Firewall)
  ├─ VPC Isolation
  └─ IP Whitelisting

Layer 2: Transport Security
  ├─ SSL/TLS Encryption
  ├─ Certificate Validation
  └─ Encrypted Connections

Layer 3: Authentication
  ├─ Master User Credentials
  ├─ IAM Database Authentication (optional)
  └─ Password Policies

Layer 4: Authorization
  ├─ Database User Permissions
  ├─ GRANT/REVOKE Controls
  └─ Role-Based Access

Layer 5: Data Security
  ├─ Encryption at Rest (AES-256)
  ├─ Encrypted Backups
  └─ KMS Key Management

Layer 6: Application Security
  ├─ JWT Token Verification
  ├─ Prepared Statements
  └─ Input Validation

Layer 7: Monitoring & Auditing
  ├─ CloudWatch Logs
  ├─ CloudTrail Audit Logs
  └─ Performance Insights


═══════════════════════════════════════════════════════════════════════════
                        BACKUP & RECOVERY
═══════════════════════════════════════════════════════════════════════════

Automated Backups (Daily)
  ├─ Full backup at 03:00 UTC
  ├─ Transaction logs every 5 minutes
  ├─ Retention: 7 days
  └─ Stored in S3 (encrypted)

Manual Snapshots
  ├─ On-demand snapshots
  ├─ Retained indefinitely
  ├─ Can copy to other regions
  └─ Used for long-term archival

Point-in-Time Recovery
  ├─ Restore to any second
  ├─ Within retention period
  ├─ Creates new DB instance
  └─ Original remains unchanged

Disaster Recovery
  ├─ Multi-AZ deployment (optional)
  ├─ Automatic failover (< 2 min)
  ├─ Read replicas for scaling
  └─ Cross-region replication


═══════════════════════════════════════════════════════════════════════════
```
