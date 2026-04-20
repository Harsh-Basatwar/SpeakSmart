# AWS RDS Migration Checklist

## Pre-Migration

- [ ] AWS account created and verified
- [ ] Billing alerts configured
- [ ] Local database backed up
- [ ] Schema and data verified locally
- [ ] Application tested locally

## RDS Setup

- [ ] RDS MySQL instance created
- [ ] Instance identifier: `speaksmart-db`
- [ ] MySQL version: 8.0.x
- [ ] Instance class selected (db.t3.micro for free tier)
- [ ] Storage configured (20 GB minimum)
- [ ] Public access enabled (for development)
- [ ] Initial database name: `english_learning_platform`
- [ ] Master username and password saved securely

## Security Configuration

- [ ] Security group created
- [ ] Inbound rule added for port 3306
- [ ] Your IP address whitelisted
- [ ] Application server IP whitelisted (if applicable)
- [ ] SSL/TLS enabled
- [ ] Encryption at rest enabled

## Database Migration

- [ ] Local database exported (mysqldump or MySQL Workbench)
- [ ] Backup file verified (can open and read)
- [ ] Connected to RDS from MySQL Workbench
- [ ] Schema imported to RDS
- [ ] Data imported to RDS
- [ ] Table count verified (should be 8 tables)
- [ ] Row counts verified for each table
- [ ] Indexes verified
- [ ] Foreign keys verified

## Application Configuration

- [ ] `.env` file updated with RDS endpoint
- [ ] DB_HOST set to RDS endpoint
- [ ] DB_USER set to admin (or your username)
- [ ] DB_PASSWORD set correctly
- [ ] DB_SSL set to true
- [ ] Connection pool settings configured
- [ ] `config/database.js` updated with SSL support

## Testing

- [ ] Connection test passed (`node test-db.js`)
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] User signup works
- [ ] User login works
- [ ] Flashcards API works
- [ ] Quiz API works
- [ ] Admin dashboard loads
- [ ] Teacher dashboard loads
- [ ] Student dashboard loads
- [ ] Progress tracking works
- [ ] All CRUD operations tested

## Monitoring Setup

- [ ] CloudWatch alarms configured
- [ ] CPU utilization alarm
- [ ] Storage space alarm
- [ ] Connection count alarm
- [ ] Performance Insights enabled
- [ ] Enhanced Monitoring enabled (optional)

## Backup & Recovery

- [ ] Automated backups enabled
- [ ] Backup retention period set (7 days minimum)
- [ ] Manual snapshot created
- [ ] Snapshot restore tested
- [ ] Backup schedule documented

## Security Hardening

- [ ] Strong password used (16+ characters)
- [ ] Security group rules minimized
- [ ] SSL/TLS enforced
- [ ] Encryption at rest enabled
- [ ] CloudTrail logging enabled
- [ ] Regular security audits scheduled

## Documentation

- [ ] RDS endpoint documented
- [ ] Credentials stored in password manager
- [ ] Security group ID documented
- [ ] Backup procedures documented
- [ ] Disaster recovery plan created
- [ ] Team members trained

## Cost Management

- [ ] Billing alerts configured
- [ ] Free tier limits understood
- [ ] Cost optimization reviewed
- [ ] Auto-scaling configured
- [ ] Unused resources identified

## Post-Migration

- [ ] Old local database backed up
- [ ] Application running on RDS for 24 hours
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Users can access application
- [ ] Data integrity verified
- [ ] Rollback plan documented

## Production Readiness (if applicable)

- [ ] Move to private subnet
- [ ] Remove public access
- [ ] Use VPN or bastion host
- [ ] Enable Multi-AZ deployment
- [ ] Configure read replicas (if needed)
- [ ] Set up disaster recovery
- [ ] Load testing completed
- [ ] Security audit passed

---

## Quick Reference

### RDS Endpoint
```
speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:3306
```

### Connection String
```
mysql -h speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p
```

### .env Configuration
```env
DB_HOST=speaksmart-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=english_learning_platform
DB_USER=admin
DB_PASSWORD=your_password
DB_SSL=true
```

### Test Connection
```bash
node server/test-db.js
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect | Check security group |
| Access denied | Verify credentials |
| Timeout | Check network/firewall |
| SSL error | Set DB_SSL=false or download cert |
| Too many connections | Increase pool limit |

---

## Emergency Contacts

- AWS Support: https://console.aws.amazon.com/support/
- RDS Documentation: https://docs.aws.amazon.com/rds/
- MySQL Documentation: https://dev.mysql.com/doc/

---

## Rollback Plan

If migration fails:

1. **Stop application server**
2. **Revert .env to local settings**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=local_password
   ```
3. **Restart application**
4. **Verify local database is intact**
5. **Document issues encountered**
6. **Plan retry with fixes**

---

**Migration Date**: _______________
**Completed By**: _______________
**Verified By**: _______________
**Status**: ⬜ In Progress  ⬜ Complete  ⬜ Rolled Back
