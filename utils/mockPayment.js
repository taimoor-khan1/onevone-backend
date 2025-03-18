/**
 * Confirm a mock $10 deposit
 * @param {string} userId - ID of the user making the deposit
 * @returns {Promise<string>} - Confirmation message
 */
const confirmDeposit = async (userId) => {
    try {
      // Simulate a successful deposit
      return `$10 deposit confirmed for user ${userId}`;
    } catch (err) {
      console.error('Error confirming deposit:', err.message);
      throw new Error('Failed to confirm deposit');
    }
  };
  
  /**
   * Confirm a mock $18 payout
   * @param {string} winnerId - ID of the winner
   * @returns {Promise<string>} - Confirmation message
   */
  const confirmPayout = async (winnerId) => {
    try {
      // Simulate a successful payout
      return `$18 payout confirmed for winner ${winnerId}`;
    } catch (err) {
      console.error('Error confirming payout:', err.message);
      throw new Error('Failed to confirm payout');
    }
  };
  
  module.exports = { confirmDeposit, confirmPayout };