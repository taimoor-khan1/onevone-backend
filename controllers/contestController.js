const Contest = require('../models/Contest');
const User = require('../models/User');
const { confirmDeposit } = require('../utils/mockPayment');

// Create contest
// exports.createContest = async (req, res) => {
//   const { challengeeId } = req.body;
//   try {
//     // Validation
//     if (!challengeeId) {
//       return res.status(400).json({ error: 'Please provide challengee ID' });
//     }

//     // Confirm $10 deposit
//     const depositMessage = await confirmDeposit(req.user.userId);
//     console.log(depositMessage);

//     // Create contest
//     const contest = new Contest({
//       challenger: req.user.userId,
//       challengee: challengeeId,
//     });
//     await contest.save();

//     res.status(201).json({ message: 'Contest created successfully', contest });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// controllers/contestController.js
exports.createContest = async (req, res) => {
  const { username, email } = req.body;
  try {
    // Validation
    if (!username && !email) {
      return res.status(400).json({ error: 'Please provide username or email' });
    }

    // Find the challengee by username or email
    const challengee = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!challengee) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create contest
    const contest = new Contest({
      challenger: req.user.userId,
      challengee: challengee._id,
    });
    await contest.save();

    res.status(201).json({ message: 'Contest created successfully', contest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept/Decline contest
exports.updateContestStatus = async (req, res) => {
  const { contestId, status } = req.body;
  try {
    // Validation
    if (!contestId || !status) {
      return res.status(400).json({ error: 'Please provide contest ID and status' });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    contest.status = status;
    await contest.save();

    res.json({ message: 'Contest status updated successfully', contest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptContest = async (req, res) => {
  const { contestId } = req.body;

  try {
    // Update contest status to "accepted"
    const contest = await Contest.findByIdAndUpdate(
      contestId,
      { status: 'accepted' },
      { new: true }
    );

    // Generate redirection link for both players
    const redirectUrl = `https://www.chess.com/play/online/new?username1=${contest.challenger}&username2=${contest.challengee}&contestId=${contestId}`;

    res.json({ message: 'Contest accepted', redirectUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 