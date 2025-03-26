// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const contestRoutes = require('./routes/contestRoutes');
// const payoutRoutes = require('./routes/payoutRoutes');
// const userRoutes = require('./routes/userRoutes');
// const playRoutes = require('./routes/playRoutes');
// const errorHandler = require('./middleware/errorHandler');
// const fileUpload = require('express-fileupload');
// const path = require('path');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(fileUpload());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/contest', contestRoutes);
// app.use('/api/payout', payoutRoutes);
// app.use('/api/play', playRoutes);
// app.use('/api', userRoutes);


// // Error handling
// app.use(errorHandler);

// // Connect to DB
// connectDB();

// module.exports = app;

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contestRoutes = require('./routes/contestRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const userRoutes = require('./routes/userRoutes');
const playRoutes = require('./routes/playRoutes');
const errorHandler = require('./middleware/errorHandler');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/play', playRoutes);
app.use('/api', userRoutes);

// Error handling
app.use(errorHandler);

// Connect to DB
connectDB();

module.exports = app;