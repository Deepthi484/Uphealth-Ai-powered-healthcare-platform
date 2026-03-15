const mongoose = require('mongoose');

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://madhavchelluri:Amrajkima%401234@cluster0.lbx7s5b.mongodb.net/uphealth?retryWrites=true&w=majority&appName=Cluster0';

// Database connection options
const options = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
};

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, options);
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🎉 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDB;
