// server/controllers/UserController.js
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../db'); 


const signup = async(req, res) => {
    console.log('Received request body:', req.body); // Log request body immediately

    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const userCheck = await db.query(
        'SELECT id FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [username, email, passwordHash]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  };


// Function to fetch all books a user has purchased
const getUserLibrary = async (username) => {
  const query = `
    SELECT books.id, books.name, books.author, books.cover_image_url, books.cover_image_alt
    FROM purchases
    JOIN books ON purchases.book_id = books.id
    JOIN users ON purchases.user_id = users.id
    WHERE users.username = $1;
  `;

  try {
    const result = await db.query(query, [username]);
    return result.rows; // Return the list of books
  } catch (error) {
    console.error('Error in getUserLibrary:', error);
    throw new Error('Unable to fetch user library');
  }
};

module.exports = {
  signup, getUserLibrary,
};


