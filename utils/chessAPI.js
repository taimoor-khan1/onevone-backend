const axios = require('axios');

/**
 * Extract the username from a Chess.com player URL
 * @param {string} url - Chess.com player URL
 * @returns {string} - Extracted username
 */
const extractUsername = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1]; // The last part of the URL is the username
};

const fetchMatchResults = async (gameId) => {
  try {
    const response = await axios.get(`https://api.chess.com/pub/game/${gameId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching match results:', err.message);
    throw new Error('Failed to fetch match results');
  }
};

/**
 * Verify the winner of a match using Chess.com API
 * @param {string} player1 - Chess.com username of player 1
 * @param {string} player2 - Chess.com username of player 2
 * @returns {Promise<string>} - Username of the winner
 */
const verifyWinner = async (player1, player2) => {
  try {
    // Validate player1 and player2
    if (!player1 || !player2) {
      throw new Error('Both player1 and player2 must be provided');
    }

    // Fetch match results for player1
    const games = await getMatchResults(player1);

    // Find the latest game between player1 and player2
    const match = games.find((game) => {
      if (!game.white || !game.black) {
        console.warn('Invalid game data:', game);
        return false;
      }

      // Extract usernames from URLs
      const white = extractUsername(game.white);
      const black = extractUsername(game.black);

      if (!white || !black) {
        console.warn('Invalid usernames in game data:', game);
        return false;
      }

      return (
        (white.toLowerCase() === player1.toLowerCase() && black.toLowerCase() === player2.toLowerCase()) ||
        (white.toLowerCase() === player2.toLowerCase() && black.toLowerCase() === player1.toLowerCase())
      );
    });

    if (!match) {
      throw new Error('No match found between the players');
    }

    // Extract usernames from URLs for the matched game
    const white = extractUsername(match.white);
    const black = extractUsername(match.black);

    // Determine the winner
    if (match.result === 'win') {
      return white.toLowerCase() === player1.toLowerCase() ? player1 : player2;
    } else if (match.result === 'checkmated' || match.result === 'resigned') {
      return white.toLowerCase() === player1.toLowerCase() ? player2 : player1;
    } else {
      throw new Error('Match result is a draw or incomplete');
    }
  } catch (err) {
    console.error('Error verifying winner:', err.message);
    throw new Error('Failed to verify winner');
  }
};
const getMatchResults = async (username) => {
  try {
    const response = await axios.get(`https://api.chess.com/pub/player/${username}/games`);
    return response.data.games;
  } catch (err) {
    console.error('Error fetching match results from Chess.com:', err.message);
    throw new Error('Failed to fetch match results');
  }
};

module.exports = { getMatchResults, verifyWinner ,fetchMatchResults};