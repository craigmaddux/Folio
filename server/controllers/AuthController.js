// server/controllers/AuthController.js
const db = require('../db');
const bcrypt = require('bcrypt');

const validateLogin = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  try {
    console.log("User: " + username);
    // Retrieve user with the correct password_hash column
    const result = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      throw new Error('Invalid username or password');
    }

    const user = result.rows[0];

    // Ensure password_hash is not null or undefined
    if (!user.password_hash) {
      throw new Error('Invalid username or password');
    }

    

    // Validate the password
    const passwordIsValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) {
      throw new Error('Invalid username or password');
    }
    console.log("id: " + user.id + " user: " + user.username);
    return { message: 'Login successful', id: user.id, username: user.username };

  } catch (error) {
    console.error('Error during login validation:', error);
    throw new Error('Login failed');
  }
};

module.exports = {
  validateLogin,
};
