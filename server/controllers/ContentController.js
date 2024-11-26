const fs = require('fs');
const path = require('path');
const Epub = require('epub2'); // Ensure epub2 is installed: `npm install epub2`

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

  // Method to fetch EPUB metadata
  static async getMetadata(req, res) {
    const { bookId } = req.params;
    const filePath = path.join(__dirname, '../ebooks', `${bookId}.epub`);

    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Book not found' });
      }

      const epub = new Epub(filePath);

      epub.on('end', () => {
        const metadata = {
          title: epub.metadata.title,
          author: epub.metadata.creator,
          description: epub.metadata.description,
          cover: epub.metadata.cover,
        };

        res.json(metadata);
      });

      epub.on('error', (err) => {
        console.error('EPUB Error:', err.message);
        res.status(500).json({ error: 'Failed to process EPUB' });
      });

      epub.parse();
    } catch (error) {
      console.error('Error fetching metadata:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method to fetch specific chapter content
  static async getEpubContent(req, res) {
    const { bookId, chapterId } = req.params;
    const filePath = path.join(__dirname, '../ebooks', `${bookId}.epub`);

    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Book not found' });
      }

      const epub = new Epub(filePath);

      epub.on('end', () => {
        const chapter = epub.flow[chapterId];
        if (!chapter) {
          return res.status(404).json({ error: 'Chapter not found' });
        }

        epub.getChapter(chapter.id, (err, text) => {
          if (err) {
            console.error('Error fetching chapter:', err.message);
            return res.status(500).json({ error: 'Failed to fetch chapter' });
          }

          res.json({ content: text });
        });
      });

      epub.on('error', (err) => {
        console.error('EPUB Error:', err.message);
        res.status(500).json({ error: 'Failed to process EPUB' });
      });

      epub.parse();
    } catch (error) {
      console.error('Error fetching content:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method to download the full EPUB file
  static async downloadBook(req, res) {
    const { bookId } = req.params;
    const filePath = path.join(__dirname, '../ebooks', `${bookId}`);
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.download(filePath);
    } catch (error) {
      console.error('Error downloading book:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ContentController;
