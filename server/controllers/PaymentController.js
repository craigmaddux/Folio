const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

class PaymentController {
  static async purchaseCredits(req, res) {
    const { userId, credits, amount } = req.body;

    try {
      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects the amount in cents
        currency: 'usd',
        metadata: { userId, credits },
        automatic_payment_methods: { enabled: true },
      });

      // Respond with the Payment Intent client secret
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating Payment Intent:', error.message);
      res.status(500).json({ error: 'Failed to process payment' });
    }
  }

  static async confirmPurchase(req, res) {
    const { userId, credits, amount } = req.body;

    try {
      // Update user's credits
      await db.query(
        'UPDATE users SET credits = credits + $1 WHERE id = $2',
        [credits, userId]
      );

      // Log the credit purchase
      await db.query(
        'INSERT INTO credit_purchases (user_id, credits_purchased, amount_paid) VALUES ($1, $2, $3)',
        [userId, credits, amount]
      );

      res.json({ message: 'Credits purchased successfully' });
    } catch (error) {
      console.error('Error updating credits:', error.message);
      res.status(500).json({ error: 'Failed to confirm purchase' });
    }
  }
}

module.exports = PaymentController;
