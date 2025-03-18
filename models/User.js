const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '/uploads/default-avatar.png' }, // Local default avatar
  verificationCode: { type: String, default: '' },
  resetPasswordToken: { type: String, default: '' },
  balance: { type: Number, default: 0 },
  player_id: { type: Number, default: 0 },
  url: { type: String,  unique: true ,default: ''},
  country: { type: String, default: ''},
  
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);