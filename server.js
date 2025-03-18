
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');
require('./utils/cron');
const PORT = config.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle challenge events
  socket.on('challenge', async (data) => {
    const { challenger, challengee } = data;

    // Emit the challenge to the challengee
    io.to(challengee).emit('challengeReceived', { challenger });
  });

  // Handle challenge response (accept/reject)
  socket.on('challengeResponse', async (data) => {
    const { challenger, challengee, response } = data;

    if (response === 'accept') {
      // Redirect both users to Chess.com
      const chessComUrl = `https://www.chess.com/play/online/new?username1=${challenger}&username2=${challengee}`;
      io.to(challenger).emit('redirect', { url: chessComUrl });
      io.to(challengee).emit('redirect', { url: chessComUrl });
    } else if (response === 'reject') {
      // Notify the challenger that the challenge was rejected
      io.to(challenger).emit('challengeRejected', { challengee });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Connect to MongoDB
connectDB();

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});