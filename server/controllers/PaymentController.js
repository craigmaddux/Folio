const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

class PaymentController {
  static async purchaseCredits(req, res) {
    const { userId, credits, amount } = req.body;

    try {
      console.log("Amount: " + amount);
      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects the amount in cents
        currency: 'usd',
        metadata: { userId, credits },
        payment_method_types: ['us_bank_account'], // Specify ACH payments only
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
    console.log("Confirming Purchase.");
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

  // Webhook handler
  static async handleChargeResponse(req, res) {
    const sig = req.headers['stripe-signature'];
    console.log("Processing webhook.");
    console.log("Req" + req);
    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody, // Raw body needed for Stripe signature verification
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // Secret key from Stripe webhook configuration
      );

      console.log("Event Type: " + event.type);   
      switch (event.type) {
        case 'charge.succeeded': {
          const paymentIntent = event.data.object;
          const { metadata } = paymentIntent;
          console.log("Metadata: " + metadata);
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
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}

module.exports = PaymentController;
