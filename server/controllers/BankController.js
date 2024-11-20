const db = require('../db');
const { encrypt, decrypt } = require('../utils/encryption');

// Add or update bank details for an author
const addOrUpdateBankDetails = async (req, res) => {
  const { accountNumber, routingNumber } = req.body;
  const authorId = req.user.id; // Ensure the user is authenticated

  try {
    // Encrypt sensitive data
    const encryptedAccountNumber = encrypt(accountNumber);
    const encryptedRoutingNumber = encrypt(routingNumber);

    // Insert or update bank details in the database
    const result = await db.query(
      `INSERT INTO authors_bank_details (author_id, encrypted_account_number, encrypted_routing_number)
       VALUES ($1, $2, $3)
       ON CONFLICT (author_id)
       DO UPDATE SET encrypted_account_number = $2, encrypted_routing_number = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [authorId, encryptedAccountNumber, encryptedRoutingNumber]
    );

    res.status(200).json({ message: 'Bank details saved successfully', details: result.rows[0] });
  } catch (error) {
    console.error('Error saving bank details:', error);
    res.status(500).json({ message: 'Failed to save bank details' });
  }
};

// Get bank details for an author
const getBankDetails = async (req, res) => {
  const authorId = req.user.id; // Ensure the user is authenticated

  try {
    const result = await db.query(
      `SELECT encrypted_account_number, encrypted_routing_number FROM authors_bank_details WHERE author_id = $1`,
      [authorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No bank details found' });
    }

    // Decrypt sensitive data
    const bankDetails = {
      accountNumber: decrypt(result.rows[0].encrypted_account_number),
      routingNumber: decrypt(result.rows[0].encrypted_routing_number),
    };

    res.status(200).json({ bankDetails });
  } catch (error) {
    console.error('Error retrieving bank details:', error);
    res.status(500).json({ message: 'Failed to retrieve bank details' });
  }
};

module.exports = {
  addOrUpdateBankDetails,
  getBankDetails,
};
