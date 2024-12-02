const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db'); // Ensure you have access to your database connection

// Use the raw body parser for Stripe to handle the webhook signature
router.post(
  '/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => { // Mark the handler as async
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // Handle different types of events
      switch (event.type) {
        case 'charge.succeeded':
          const paymentIntent = event.data.object;
          const { metadata } = paymentIntent;

          if (!metadata.userId || !metadata.credits) {
            console.error('Invalid metadata in payment intent');
            return res.status(400).json({ error: 'Invalid metadata' });
          }

          const userId = metadata.userId;
          const credits = parseInt(metadata.credits, 10);
          const amountPaid = paymentIntent.amount / 100; // Stripe amounts are in cents

          // Update user's credits and log the transaction
          await db.query(
            'UPDATE users SET credits = credits + $1 WHERE id = $2',
            [credits, userId]
          );

          await db.query(
            'INSERT INTO credit_purchases (user_id, credits_purchased, amount_paid) VALUES ($1, $2, $3)',
            [userId, credits, amountPaid]
          );

          console.log(`Credits updated for user ${userId}`);
          break;

        case 'charge.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`);
          // TODO: Add business logic for failed payments
          break;

        // Add more cases as needed
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Send a success response after handling the event
      res.status(200).send({ received: true });
    } catch (error) {
      console.error('Error processing webhook event:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
