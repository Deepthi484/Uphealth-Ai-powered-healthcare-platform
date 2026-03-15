require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions_new');
const predictionWithHistoryRoutes = require('./routes/predictions_with_history');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'UpHealth Backend Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/predictions-v2', predictionWithHistoryRoutes); // New route with history

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered'
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB Atlas
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 UpHealth Backend Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
