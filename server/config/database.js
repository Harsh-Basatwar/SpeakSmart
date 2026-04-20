const mysql = require('mysql2');
require('dotenv').config();

// SSL/TLS configuration for AWS RDS
const sslConfig = process.env.DB_SSL === 'true' ? {
  rejectUnauthorized: true
} : false;

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'english_learning_platform',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: sslConfig
});

// Get promise-based pool for async/await
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    console.error('💡 Make sure MySQL is running and credentials are correct in .env');
  } else {
    console.log('✅ MySQL Connected Successfully');
    connection.release();
  }
});

// Graceful shutdown - ECS sends SIGTERM, not SIGINT
const shutdown = () => {
  pool.end((err) => {
    if (err) console.error('Error closing MySQL pool:', err);
    else console.log('MySQL pool closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { pool, promisePool };
