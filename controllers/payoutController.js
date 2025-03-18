const Payout = require('../models/Payout');
const { confirmPayout } = require('../utils/mockPayment');

// Confirm payout
exports.confirmPayout = async (req, res) => {
  const { winner, amount } = req.body;
  try {
    // Validation
    if (!winner || !amount) {
      return res.status(400).json({ error: 'Please provide winner and amount' });
    }

    // Confirm $18 payout
    const payoutMessage = await confirmPayout(winner);
    console.log(payoutMessage);

    // Save payout details
    const payout = new Payout({ winner, amount, status: 'confirmed' });
    await payout.save();

    res.json({ message: `Winner: ${winner}, $${amount} Prize Confirmed` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};