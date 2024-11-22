// server/routes/api.js
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const BookController = require('../controllers/BookController');
const PurchaseController = require('../controllers/PurchaseController');
const AuthorController = require('../controllers/AuthorController');
const BankController = require('../controllers/BankController');
const PaymentController = require('../controllers/PaymentController');
const ContentController = require('../controllers/ContentController');

const db = require('../db'); // Database connection
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

/** ================== User Routes ================== */

// User Signup with validation
router.post(
  '/signup',
  [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim(),
  ],
  UserController.signup
);

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await AuthController.validateLogin(username, password);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ message: error.message });
  }
});

// Fetch User Library
router.get('/library/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const books = await UserController.getUserLibrary(username);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({ message: 'Failed to fetch library' });
  }
});

/** ================== Book Routes ================== */

// Fetch all books
router.get('/books', BookController.fetchBooks);

// Fetch book content by ID
router.get('/books/:bookId/content', BookController.getBookContent);

// Save and retrieve reading progress
router.post('/books/:bookId/progress', BookController.saveReadingProgress);
router.get('/books/:bookId/progress', BookController.getReadingProgress);

// Upload a new book
router.post(
  '/books/upload',
  upload.fields([{ name: 'cover' }, { name: 'content' }]),
  BookController.uploadBook
);

// Fetch details of a single book
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

/** ================== Purchase Routes ================== */

// Purchase credits
router.post('/purchase-credits', PaymentController.purchaseCredits);
router.post('/confirm-purchase', PaymentController.confirmPurchase);

// Record a book purchase
router.post('/purchase', async (req, res) => {
  const { userId, bookId, purchasePrice } = req.body;
  try {
    const result = await PurchaseController.recordPurchase(
      userId,
      bookId,
      purchasePrice
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error recording purchase:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/** ================== Author Routes ================== */

// Author profile management
router.get('/authors/:userId', AuthorController.getAuthorProfile);
router.post('/authors/:userId', AuthorController.upsertAuthorProfile);

// Author profile existence check
router.get('/authors/:userId/exists', AuthorController.checkAuthorProfile);

// Bank details management
router.post('/authors/bank-details', BankController.addOrUpdateBankDetails);
router.get('/authors/bank-details', BankController.getBankDetails);

/** ================== Miscellaneous Routes ================== */

// Serve HTML content dynamically
router.get('/content', ContentController.getContent);

module.exports = router;
