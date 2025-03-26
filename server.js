
// const http = require('http');
// const socketIo = require('socket.io');
// const app = require('./app');
// const connectDB = require('./config/db');
// const config = require('./config/env');
// require('./utils/cron');
// const PORT = config.PORT || 5000;

// // Create HTTP server
// const server = http.createServer(app);

// // Set up Socket.IO
// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });
// const userSocketMap = new Map();

// // Socket.IO connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Store the socket ID when a user logs in
//   socket.on('storeSocketId', (username) => {
//     userSocketMap.set(username, socket.id); // Map username to socket ID
//     console.log(`User ${username} connected with socket ID: ${socket.id}`);
//   });

//   // Handle challenge
//   socket.on('challenge', (data) => {
//     const { challenger, challengee } = data;

//     // Get the challengee's socket ID
//     const challengeeSocketId = userSocketMap.get(challengee);

//     if (challengeeSocketId) {
//       // Emit the challenge to the challengee
//       io.to(challengeeSocketId).emit('challengeReceived', { challenger });
//     } else {
//       console.log(`User ${challengee} is not connected.`);
//     }
//   });

//   // Handle challenge response
//   socket.on('challengeResponse', (data) => {
//     const { challenger, challengee, response } = data;

//     // Get the challenger's socket ID
//     const challengerSocketId = userSocketMap.get(challenger);

//     if (challengerSocketId) {
//       // Emit the response to the challenger
//       io.to(challengerSocketId).emit('challengeResponse', { response });
//     } else {
//       console.log(`User ${challenger} is not connected.`);
//     }
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     // Remove the user from the socket map
//     for (const [username, socketId] of userSocketMap.entries()) {
//       if (socketId === socket.id) {
//         userSocketMap.delete(username);
//         console.log(`User ${username} disconnected: ${socket.id}`);
//         break;
//       }
//     }
//   });
// });



// // Attach Socket.IO to the app
// app.set('io', io);
// // Connect to MongoDB
// connectDB();

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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
const userSocketMap = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store the socket ID when a user logs in
  socket.on('storeSocketId', (username) => {
    userSocketMap.set(username, socket.id); // Map username to socket ID
    console.log(`User ${username} connected with socket ID: ${socket.id}`);
  });

  // Handle challenge
  socket.on('challenge', (data) => {
    const { challenger, challengee } = data;
    console.log(challenger)
    // Get the challengee's socket ID
    const challengeeSocketId = userSocketMap.get(challengee);

    if (challenger) {
      // Emit the challenge to the challengee
      io.emit('challengeReceived', { challenger,challengee });
    } else {
      console.log(`User ${challengee} is not connected.`);
    }
  });

  // Handle challenge response
  socket.on('challengeResponse', (data) => {
    const { challenger, challengee, response } = data;

    // Get the challenger's socket ID
    // const challengerSocketId = userSocketMap.get(challenger);

    if (response) {
      // Emit the response to the challenger
      io.emit('challengeResponse', {challenger,challengee, response });
    } else {
      console.log(`User ${challenger} is not connected.`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove the user from the socket map
    for (const [username, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(username);
        console.log(`User ${username} disconnected: ${socket.id}`);
        break;
      }
    }
  });
});

// Attach Socket.IO to the app
app.set('io', io);
// Connect to MongoDB
connectDB();

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});