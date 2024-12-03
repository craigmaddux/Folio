// server/controllers/UserController.js
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../db'); 

const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email.js');

const signup = async (req, res) => {
  console.log('Received request body:', req.body);

  // Validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    console.log("Checking if user exists:", username);
    const userCheck = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (userCheck.rows.length > 0) {
      console.log("User exists.");
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user with `isVerified` set to false
    console.log("Inserting user.");
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, is_verified, verification_token) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, email, passwordHash, false, verificationToken]
    );
    const userId = result.rows[0].id;

    // Send verification email
    console.log("Sending verification email.");
    
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      userId: userId,
    });
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

const validateEmail = async (req, res) => {
  try {
    const { token } = req.query; // Extract the token from the query parameters

    // Check if the token exists in the database
    const result = await db.query(
      'SELECT id, verification_expires FROM users WHERE verification_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    const user = result.rows[0];

    // Check if the token has expired
    if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired. Please request a new one.' });
    }

    // Update the user's `isVerified` status and clear the token
    await db.query(
      'UPDATE users SET is_verified = true, verification_token = NULL, verification_expires = NULL WHERE id = $1',
      [user.id]
    );

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Failed to verify email.' });
  }
};


module.exports = {
  signup, getUserLibrary, validateEmail,
};


