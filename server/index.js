// server/index.js
const express = require('express');
const db = require('./db'); // Import the db connection
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);



// server/index.js or server/app.js
app.use((req, res, next) => {
  
  next();
});

// Test route to confirm database connection
app.get('/api/test-db', async (req, res) => {
    try {
      const result = await db.query('SELECT NOW()'); // Query current time
      res.json({ message: 'Database connected successfully', time: result.rows[0] });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).json({ message: 'Database connection failed' });
    }
  });
// server/index.js or server/app.js
app.post('/test-json', (req, res) => {
  console.log('Received body in /test-json route:', req.body);
  res.json({ receivedBody: req.body });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 