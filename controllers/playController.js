const Contest = require("../models/Contest");
const { verifyWinner, fetchMatchResults } = require("../utils/chessAPI");

exports.redirectToChessCom = async (req, res) => {
  const { player1, player2 } = req.body;

  try {
    // Validation
    if (!player1 || !player2) {
      return res
        .status(400)
        .json({ error: "Please provide both player usernames" });
    }

    // Generate a unique Chess.com game URL
    const gameUrl = `https://www.chess.com/play/online/new?username1=${player1}&username2=${player2}`;

    res.json({ redirectUrl: gameUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Handle callback from Chess.com after the match is completed
 */
exports.chessComCallback = async (req, res) => {
  const { gameId } = req.query;

  try {
    // Validation
    if (!gameId) {
      return res.status(400).json({ error: "Game ID is required" });
    }

    // Fetch match results using the Chess.com API
    const matchResults = await fetchMatchResults(gameId);

    // Verify the winner
    const winner = await verifyWinner(
      matchResults.player1,
      matchResults.player2
    );

    // Update the contest status in your database
    await Contest.updateOne(
      { gameId },
      { $set: { status: "completed", winner } }
    );

    res.json({ message: "Match results processed successfully", winner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Fetch match results from Chess.com and verify the winner
 */
exports.processMatchResults = async (req, res) => {
  const { contestId } = req.body;

  try {
    // Fetch the contest details
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Fetch match results using the Chess.com API
    const matchResults = await fetchMatchResults(contest.gameUrl);

    // Verify the winner
    const winner = await verifyWinner(contest.challenger, contest.challengee);

    // Update the contest status and winner
    await Contest.findByIdAndUpdate(
      contestId,
      { status: 'completed', winner }
    );

    // Mock payout confirmation
    const payoutMessage = `Winner: ${winner}, $18 Prize Confirmed`;

    res.json({ message: 'Match results processed successfully', payoutMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};