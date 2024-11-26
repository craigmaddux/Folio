// server/index.js
const path = require('path');
const express = require('express');
const db = require('./db'); // Import the db connection
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
// Serve static HTML files
app.use('/static/html', express.static(path.join(__dirname, 'static/html')));


// server/index.js or server/app.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 