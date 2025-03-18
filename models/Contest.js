const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  entryFee: { type: Number, default: 10 },
});

module.exports = mongoose.model('Contest', contestSchema);