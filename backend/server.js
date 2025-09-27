
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// --- START OF FIX: Add startup check for JWT_SECRET ---
if (!process.env.JWT_SECRET) {
    console.error('\n\n--- FATAL ERROR: JWT_SECRET is not defined in the environment variables. ---');
    console.error('The backend server cannot start without a secret key for signing tokens.');
    console.error('1. Open the ".env" file in the "/backend" directory.');
    console.error('2. Add a line for JWT_SECRET with a long, random, secret string.');
    console.error('Example: JWT_SECRET=your_super_secret_and_random_string_here\n\n');
    process.exit(1);
}
// --- END OF FIX ---

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const templeRoutes = require('./routes/templeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contentRoutes = require('./routes/contentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');


const app = express();

// Body parser
app.use(express.json());

// Enable CORS - For production, you might want to restrict this
// Example: app.use(cors({ origin: 'https://your-frontend-domain.up.railway.app' }));
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/temples', templeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);


// Error Handler Middleware (must be after mounting routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Important for containerized environments

const server = app.listen(
  PORT,
  HOST,
  console.log(`Server running on http://${HOST}:${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
