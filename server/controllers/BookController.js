const db = require('../db'); // Database connection
const multer = require('multer');
const path = require('path');

// Fetch books (general or user-purchased)
const fetchBooks = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 4;
  const username = req.query.username; // Optional username for purchased books

  try {
    let query, params;

    if (username) {
      // Fetch user-purchased books
      query = `
        SELECT books.id, books.name, books.author, books.cover_image_url, books.cover_image_alt, books.price, books.description
        FROM purchases
        JOIN books ON purchases.book_id = books.id
        JOIN users ON purchases.user_id = users.id
        WHERE users.username = $1
        LIMIT $2
      `;
      params = [username, limit];
    } else {
      // Fetch general books
      query = `
        SELECT id, name, author, cover_image_url, cover_image_alt, price, description 
        FROM books 
        LIMIT $1
      `;
      params = [limit];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};


// Fetch paginated book content
const getBookContent = async (req, res) => {
    const { bookId } = req.params;
    const start = parseInt(req.query.start, 10) || 0; // Default to start of the book
    const length = parseInt(req.query.length, 10) || 1000; // Default length of text to fetch
  
    try {
      const result = await db.query(
        'SELECT content FROM books WHERE id = $1',
        [bookId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const content = result.rows[0].content;
      const slicedContent = content.slice(start, start + length); // Extract the portion of the content
      const hasMore = start + length < content.length; // Determine if there's more content
  
      res.json({
        content: slicedContent,
        start,
        length: slicedContent.length,
        hasMore,
      });
    } catch (error) {
      console.error('Error fetching book content:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

const uploadBook = async (req, res) => {
  const { title, price, genre } = req.body;

  if (!req.files || !req.files.cover || !req.files.content) {
    return res.status(400).json({ message: 'Cover and content files are required.' });
  }

  const cover = req.files.cover[0];
  const content = req.files.content[0];

  try {
    await db.query(
      'INSERT INTO books (name, price, genre, cover_image_url, content_file_url) VALUES ($1, $2, $3, $4, $5)',
      [title, price, genre, `/uploads/${cover.filename}`, `/uploads/${content.filename}`]
    );
    res.status(201).json({ message: 'Book uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading book:', error);
    res.status(500).json({ message: 'Failed to upload book.' });
  }
};



  
  // Save reading progress
  const saveReadingProgress = async (req, res) => {
    const { bookId } = req.params;
    const { userId, lastReadPosition } = req.body;
  
    try {
      await db.query(
        `
        INSERT INTO book_progress (user_id, book_id, last_read_position, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, book_id)
        DO UPDATE SET last_read_position = $3, updated_at = CURRENT_TIMESTAMP
        `,
        [userId, bookId, lastReadPosition]
      );
  
      res.status(200).json({ message: 'Progress saved successfully' });
    } catch (error) {
      console.error('Error saving progress:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get last read position
  const getReadingProgress = async (req, res) => {
    const { bookId } = req.params;
    const { userId } = req.query;
  
    try {
      const result = await db.query(
        'SELECT last_read_position FROM book_progress WHERE user_id = $1 AND book_id = $2',
        [userId, bookId]
      );
  
      if (result.rows.length === 0) {
        return res.json({ lastReadPosition: 0 }); // Default to the beginning
      }
  
      res.json({ lastReadPosition: result.rows[0].last_read_position });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    getBookContent,
    saveReadingProgress,
    getReadingProgress,
    fetchBooks,
    uploadBook
  };