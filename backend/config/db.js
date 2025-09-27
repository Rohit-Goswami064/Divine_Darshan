const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('\n\n--- FATAL ERROR: MONGO_URI is not defined in the environment variables. ---');
    console.error('The backend server cannot start without a database connection string.');
    console.error('1. Make sure you have a file named ".env" in the "/backend" directory.');
    console.error('2. Open the ".env" file and add your MongoDB connection string.');
    console.error('Example for local MongoDB: MONGO_URI=mongodb://127.0.0.1:27017/divine_darshan\n\n');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
