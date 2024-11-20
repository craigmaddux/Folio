const db = require('../db');

// Fetch Author Profile
const getAuthorProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM authors WHERE user_id = $1', [userId]);
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'No profile found for this user' });
    }
  } catch (error) {
    console.error('Error fetching author profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};
// Check if author profile exists
const checkAuthorProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM authors WHERE user_id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json({ hasProfile: true });
    } else {
      res.json({ hasProfile: false });
    }
  } catch (error) {
    console.error('Error checking author profile:', error);
    res.status(500).json({ message: 'Failed to check author profile' });
  }
};
// Create or Update Author Profile
const upsertAuthorProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, about, instagramLink, xLink, facebookLink } = req.body;

  try {
    await db.query(
      `
      INSERT INTO authors (user_id, first_name, last_name, about, instagram_link, x_link, facebook_link)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        first_name = $2, last_name = $3, about = $4, instagram_link = $5, x_link = $6, facebook_link = $7
      `,
      [userId, firstName, lastName, about, instagramLink, xLink, facebookLink]
    );
    res.json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Error saving author profile:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
};

module.exports = { getAuthorProfile, upsertAuthorProfile, checkAuthorProfile };
