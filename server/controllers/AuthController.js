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
  // Controller for Author Sign-Up
const authorSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingAuthor = await db.query(
      'SELECT * FROM authors WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingAuthor.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'Username or email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new author into the database
    const result = await db.query(
      'INSERT INTO authors (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      message: 'Author account created successfully',
      authorId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error during author sign-up:', error.message);
    return res
      .status(500)
      .json({ message: 'Failed to create author account', error: error.message });
  }

};

module.exports = {
  validateLogin, authorSignup
};
