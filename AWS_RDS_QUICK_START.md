# AWS RDS Quick Start Guide
## Migrate to AWS RDS in 30 Minutes

---

## ⏱️ Time Breakdown

- **10 min**: Create RDS instance
- **5 min**: Configure security
- **10 min**: Migrate database
- **5 min**: Update & test application

---

## 🚀 Step 1: Create RDS Instance (10 min)

### 1.1 Go to AWS RDS Console
```
https://console.aws.amazon.com/rds/
```

### 1.2 Click "Create database"

### 1.3 Quick Settings
```
✓ Standard create
✓ MySQL 8.0.35
✓ Free tier (or Dev/Test)

DB identifier: speaksmart-db
Master username: admin
Master password: [Create strong password - SAVE THIS!]

✓ db.t3.micro
✓ 20 GB storage
✓ Enable storage autoscaling

✓ Public access: Yes
✓ Create new security group: speaksmart-db-sg

Initial database: english_learning_platform

✓ Enable automated backups
✓ Enable encryption
```

### 1.4 Click "Create database"
- Wait 5-10 minutes
- Status: Creating → Available

---

## 🔒 Step 2: Configure Security (5 min)

### 2.1 Get Your IP Address
```bash
# Visit
https://whatismyipaddress.com/

# Or run
curl ifconfig.me
```

### 2.2 Update Security Group
```
1. RDS Console → Your DB → Security group
2. Edit inbound rules
3. Add rule:
   Type: MySQL/Aurora
   Port: 3306
   Source: My IP (or paste your IP)
4. Save rules
```

### 2.3 Get RDS Endpoint
```
RDS Console → Your DB → Connectivity & security

Copy endpoint:
speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
```

---

## 📦 Step 3: Migrate Database (10 min)

### 3.1 Export Local Database

**Option A: MySQL Workbench**
```
1. Connect to LOCAL database
2. Server → Data Export
3. Select: english_learning_platform
4. Export to: C:\backup\speaksmart.sql
5. Start Export
```

**Option B: Command Line**
```bash
# Windows
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqldump -u root -p english_learning_platform > C:\backup\speaksmart.sql

# Mac/Linux
mysqldump -u root -p english_learning_platform > ~/backup/speaksmart.sql
```

### 3.2 Test RDS Connection

**MySQL Workbench:**
```
1. New Connection
2. Hostname: [Your RDS endpoint]
3. Port: 3306
4. Username: admin
5. Password: [Your RDS password]
6. Test Connection
```

### 3.3 Import to RDS

**Option A: MySQL Workbench**
```
1. Connect to RDS
2. Server → Data Import
3. Import from: C:\backup\speaksmart.sql
4. Default schema: english_learning_platform
5. Start Import
```

**Option B: Command Line**
```bash
# Windows
mysql -h speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com ^
      -P 3306 -u admin -p english_learning_platform < C:\backup\speaksmart.sql

# Mac/Linux
mysql -h speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 -u admin -p english_learning_platform < ~/backup/speaksmart.sql
```

### 3.4 Verify Data
```sql
USE english_learning_platform;
SHOW TABLES;  -- Should show 8 tables
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM flashcards;
```

---

## ⚙️ Step 4: Update Application (5 min)

### 4.1 Update .env File

```env
# OLD (Local)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=local_password

# NEW (RDS)
DB_HOST=speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=english_learning_platform
DB_USER=admin
DB_PASSWORD=your_rds_password
DB_SSL=true
```

### 4.2 Test Connection
```bash
cd server
node test-db.js
```

**Expected output:**
```
✅ MySQL Connected Successfully
✅ Connection successful!
✅ Current database: english_learning_platform
✅ Tables found: 8
🎉 All tests passed!
```

### 4.3 Start Server
```bash
npm run dev
```

**Expected output:**
```
✅ MySQL Connected Successfully
🚀 Server running on port 5000
```

### 4.4 Test API
```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
{"status":"OK","message":"English Learning Platform API is running"}
```

---

## ✅ Verification Checklist

Quick checks to ensure everything works:

- [ ] RDS instance status: Available
- [ ] Security group allows your IP
- [ ] Can connect from MySQL Workbench
- [ ] All 8 tables exist in RDS
- [ ] Data counts match local database
- [ ] `node test-db.js` passes
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Can create new user via API
- [ ] Can login with existing user

---

## 🐛 Quick Troubleshooting

### Can't Connect to RDS

```bash
# 1. Check security group
RDS Console → Your DB → Security group → Inbound rules
Verify your IP is whitelisted

# 2. Verify endpoint
Check for typos in .env file

# 3. Test with telnet
telnet your-endpoint.rds.amazonaws.com 3306
```

### Access Denied

```bash
# 1. Verify credentials
Check DB_USER and DB_PASSWORD in .env

# 2. No extra spaces
DB_PASSWORD=password123  ✅
DB_PASSWORD=password123  ❌ (space at end)
```

### Unknown Database

```sql
-- Connect to RDS
mysql -h your-endpoint.rds.amazonaws.com -u admin -p

-- Create database
CREATE DATABASE english_learning_platform;

-- Import schema
SOURCE /path/to/database/schema.sql;
```

---

## 💰 Cost Estimate

### Free Tier (First 12 Months)
```
750 hours/month of db.t3.micro
20 GB storage
20 GB backup storage

Cost: $0/month
```

### After Free Tier
```
db.t3.micro: ~$15/month
20 GB storage: ~$2/month
Backups: ~$2/month

Total: ~$19/month
```

### Cost Optimization
```
✓ Stop database when not in use
✓ Delete old snapshots
✓ Use reserved instances (save 60%)
✓ Right-size instance based on usage
```

---

## 📚 Next Steps

### Immediate
1. ✅ Test all application features
2. ✅ Verify data integrity
3. ✅ Monitor for 24 hours

### Within 1 Week
1. Set up CloudWatch alarms
2. Configure automated backups
3. Create manual snapshot
4. Document credentials securely

### Within 1 Month
1. Review performance metrics
2. Optimize slow queries
3. Consider Multi-AZ (production)
4. Set up read replicas (if needed)

---

## 🔗 Useful Links

- **Full Setup Guide**: `AWS_RDS_MIGRATION_CHECKLIST.md`
- **Troubleshooting**: `AWS_RDS_TROUBLESHOOTING.md`
- **AWS RDS Docs**: https://docs.aws.amazon.com/rds/
- **Pricing Calculator**: https://calculator.aws/

---

## 📞 Need Help?

### Common Issues
| Problem | Solution |
|---------|----------|
| Can't connect | Check security group |
| Access denied | Verify credentials |
| Timeout | Check network/firewall |
| Unknown database | Import schema |

### Support Resources
- AWS Support: https://console.aws.amazon.com/support/
- Community Forums: https://forums.aws.amazon.com/
- Stack Overflow: Tag `amazon-rds`

---

## 🎉 Success!

If you've completed all steps and checks pass, congratulations! 

**Your application is now running on AWS RDS!**

### What You've Achieved:
✅ Production-ready database
✅ Automated backups
✅ Scalable infrastructure
✅ Enhanced security
✅ Better performance
✅ Professional deployment

### Celebrate! 🎊

Then:
1. Monitor for 24 hours
2. Test all features thoroughly
3. Update documentation
4. Train team members
5. Plan for production hardening

---

**Migration completed in**: _____ minutes

**Any issues?** Check `AWS_RDS_TROUBLESHOOTING.md`

**Ready for production?** Review security best practices in full guide.
