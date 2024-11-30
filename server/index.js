// server/index.js
const path = require('path');
const express = require('express');
const db = require('./db'); // Import the db connection
const cors = require('cors');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

const apiRoutes = require('./routes/api');

// Define allowed origins
const allowedOrigins = [
  'https://lemon-rock-0c1fe0d0f.5.azurestaticapps.net', // Add your client domain
  'https://dev.leafquill.com',
];
// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl requests)
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log("Origin: " + origin);
      const msg = 'The CORS policy for this site does not allow access from the specified origin: ';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow credentials if needed
}));

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
 