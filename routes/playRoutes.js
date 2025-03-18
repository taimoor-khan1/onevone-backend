const express = require('express');
const playController = require('../controllers/playController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authMiddleware.authenticate);

// Verify winner and redirect to Chess.com
// Protect all routes with authentication middleware
router.use(authMiddleware.authenticate);


router.post('/redirect-to-chess-com', playController.redirectToChessCom);


router.get('/callback', playController.chessComCallback);


router.post('/process-match-results', playController.processMatchResults);
module.exports = router;