const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false  // Disable SSL
});

const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
  .then(conn => {
    console.log('✅ Database connected successfully!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = promisePool;






// const mysql = require('mysql2');
// require('dotenv').config();
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD || "", // Set empty string if null
//     database: process.env.DB_NAME,
    
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database: ' + err.stack);
//     return;
//   }
//   console.log('Connected to the database');
// });

// module.exports = db;
