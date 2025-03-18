// utils/cron.js
const cron = require('node-cron');
const Contest = require('../models/Contest');
const { processMatchResults } = require('../controllers/playController');

// Schedule a task to run every hour
cron.schedule('0 * * * *', async () => {
  try {
    // Find contests that are completed but not yet paid out
    const contests = await Contest.find({ status: 'completed', payoutConfirmed: false });

    for (const contest of contests) {
      // Process match results and confirm payout
      await processMatchResults({ body: { contestId: contest._id } });

      // Update contest to mark payout as confirmed
      await Contest.findByIdAndUpdate(contest._id, { payoutConfirmed: true });
    }
  } catch (err) {
    console.error('Error processing payouts:', err.message);
  }
});

console.log('Cron job for payout processing started.');