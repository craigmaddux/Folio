// server/routes/api.js
const express = require('express');
const { body } = require('express-validator');
const {signup, getUserLibrary} = require('../controllers/UserController');
const { validateLogin } = require('../controllers/AuthController');
const { recordPurchase } = require('../controllers/PurchaseController');
const {
  getBookContent,
  saveReadingProgress,
  getReadingProgress,
  fetchBooks
} = require('../controllers/BookController');
const db = require('../db'); // Adjust this path if db.js is located elsewhere

const router = express.Router();

router.post(
  '/signup',
  [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim(),
  ],
  (req, res, next) => {
    console.log('Received body in /signup route:', req.body); // Log here first
    next();
  }, 
  signup
);

router.get('/books', fetchBooks); // Delegate to the controller
router.get('/books/:bookId/content', getBookContent);
router.post('/books/:bookId/progress', saveReadingProgress);
router.get('/books/:bookId/progress', getReadingProgress);

router.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id, name, author, description, price, cover_image_url FROM books WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch details of a single book by ID
router.get('/reader/:id', async (req, res) => {
  const bookId = req.params.id;
  console.log("retrieving book id: " + bookId);
  try {
    const result = await db.query(
      'SELECT id, name, content, author, cover_image_url, cover_image_alt, price, description FROM books WHERE id = $1',
      [bookId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ message: 'Failed to fetch book details' });
  }
});

// Purchase API endpoint
router.post('/purchase', async (req, res) => {
  const { userId, bookId, purchasePrice } = req.body;
  console.log("Data:" + JSON.stringify(req.body));
  try {
    console.log(userId + " " + bookId + " " + purchasePrice);
    // Call the controller function to record the purchase
    const result = await recordPurchase(userId, bookId, purchasePrice);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Login API endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await validateLogin(username, password);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ message: error.message });
  }
});

// Library API endpoint to get the user's purchased books
router.get('/library/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const books = await getUserLibrary(username);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({ message: 'Failed to fetch library' });
  }
});
module.exports = router;
