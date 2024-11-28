// server/db.js
require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');
const fs = require('fs');
// Create a new pool instance to manage connections
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl:{
    require: true,
    ca:fs.readFileSync("Microsoft RSA Root Certificate Authority 2017.crt").toString()},
 
});

pool.query('SELECT 1', (err, res) => {
  if (err) {
    console.error('Connection error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
  } else {
    console.log('Connection successful:', res.rows);
  }
});
// Export the pool for use in queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};
