const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
});

module.exports = mongoose.model('Payout', payoutSchema);