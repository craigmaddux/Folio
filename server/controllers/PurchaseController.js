// server/controllers/purchaseController.js
const db = require('../db'); // Database connection

// Function to record a purchase
const recordPurchase = async (user_id, book_id, price_at_purchase) => {
  if (!user_id || !book_id || !price_at_purchase) {
    throw new Error('Missing required fields');
  }

  try {
    // Insert a new purchase record into the purchases table
    await db.query(
      'INSERT INTO purchases (user_id, book_id, price_at_purchase) VALUES ($1, $2, $3)',
      [user_id, book_id, price_at_purchase]
    );
    return { message: 'Purchase recorded successfully' };
  } catch (error) {
    
    throw new Error('Failed to record purchase');
  }
};

module.exports = {
  recordPurchase,
};

