const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const stripeWebhookRouter = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
const corsOptions = {
  origin: ['https://dev.leafquill.com', 'http://localhost:3000'], // Replace with your actual domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS middleware globally
app.options('*', cors(corsOptions)); // Handle preflight requests



// Stripe Webhook route (use raw body parser for Stripe signature verification)
app.use(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }), // Raw body for Stripe
  stripeWebhookRouter
);
app.use(bodyParser.json());

// API routes
app.use('/api', apiRouter);

// Health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Debugging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
