const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentController = require('../controllers/PaymentController');
// Use the raw body parser for Stripe to handle the webhook signature
router.post(
  '/stripe-webhook',
  express.raw({ type: 'application/json' }), PaymentController.handleChargeResponse);
  
module.exports = router;
