// server/db.js
require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');

// Create a new pool instance to manage connections
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: true, // Set to true with valid CA certificate
  },
});

// Export the pool for use in queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};
