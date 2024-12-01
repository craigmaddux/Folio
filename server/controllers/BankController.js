const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.saveBankDetails = async (req, res) => {
  const { accountHolderName, accountNumber, routingNumber, accountType } = req.body;

  if (!accountHolderName || !accountNumber || !routingNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Create a bank account token using Stripe
    const bankAccountToken = await stripe.tokens.create({
      bank_account: {
        country: 'US',
        currency: 'usd',
        account_holder_name: accountHolderName,
        account_holder_type: 'individual',
        routing_number: routingNumber,
        account_number: accountNumber,
      },
    });

    // Attach the bank account to the author’s Stripe account
    const authorStripeAccountId = req.user.stripeAccountId; // Replace with actual user Stripe account logic

    await stripe.accounts.createExternalAccount(authorStripeAccountId, {
      external_account: bankAccountToken.id,
    });

    res.json({ message: 'Bank details saved successfully!' });
  } catch (error) {
    console.error('Error saving bank details:', error);
    res.status(500).json({ error: 'Failed to save bank details.' });
  }
};
