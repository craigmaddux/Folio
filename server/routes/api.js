const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const stripeWebhookRouter = require('./routes/stripeWebhookRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS for API routes
const corsOptions = {
  origin: ['https://your-frontend-domain.com', 'http://localhost:3000'], // Add allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies or authentication headers
};

// Parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Stripe Webhook route (use raw body parser for Stripe signature verification)
app.use(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }), // Raw body for Stripe
  stripeWebhookRouter
);

// CORS for all other API routes
app.use(cors(corsOptions));

// API routes
app.use('/api', apiRouter);

// Default route (for debugging or health check)
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
