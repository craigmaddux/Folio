// src/controllers/ContentController.js
const fs = require('fs');
const path = require('path');

class ContentController {
  // Method to serve HTML content
  static async getContent(req, res) {
    const { file } = req.query;
    const filePath = path.join(__dirname, '../content', `${file}.html`);

    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      res.send(data); // Send the HTML content
    } catch (err) {
      console.error('Error reading content file:', err.message);
      res.status(404).json({ error: 'Content not found' });
    }
  }
}

module.exports = ContentController;
