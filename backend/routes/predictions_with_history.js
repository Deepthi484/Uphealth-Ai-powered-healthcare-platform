const express = require('express');
const fetch = require('node-fetch');
const { authenticateUser, optionalAuth } = require('../middleware/auth');
const Prediction = require('../models/Prediction');
const connectDB = require('../config/database');

const router = express.Router();

// FastAPI server URL
const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000';

// Helper function to save prediction to database
const savePrediction = async (userId, predictionType, inputData, result, processingTime) => {
    try {
        await connectDB();
        
        const prediction = new Prediction({
            userId,
            predictionType,
            inputData,
            result: {
                prediction: result.prediction,
                confidence: result.confidence,
                predictionCode: result.prediction_code || null,
                riskLevel: result.risk_level || null,
                description: result.migraine_type || result.risk_level || null,
                recommendations: result.recommendations || [],
                vitalSignsAnalysis: result.vital_signs_analysis || []
            },
            metadata: {
                processingTime
            }
        });

        await prediction.save();
        return prediction;
    } catch (error) {
        console.error('Error saving prediction:', error);
        // Don't throw error - prediction still succeeded even if saving failed
        return null;
    }
};

// Migraine prediction with history
router.post('/migraine', optionalAuth, async (req, res) => {
    const startTime = Date.now();
    
    try {
        console.log('🧠 Migraine prediction request received');
        console.log('User:', req.user ? req.user.email : 'Anonymous');

        // Forward request to FastAPI
        const response = await fetch(`${FASTAPI_BASE_URL}/api/predictions/migraine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('FastAPI error:', response.status, errorText);
            return res.status(response.status).json({
                success: false,
                message: 'Prediction service error',
                error: errorText
            });
        }

        const result = await response.json();
        const processingTime = Date.now() - startTime;

        // Save to database if user is authenticated
        if (req.user) {
            await savePrediction(req.user._id, 'migraine', req.body, result, processingTime);
        }

        // Return the result
        res.json({
            success: true,
            ...result,
            processingTime: `${processingTime}ms`,
            saved: !!req.user // Indicates if prediction was saved to history
        });

    } catch (error) {
        console.error('❌ Migraine prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health risk prediction with history
router.post('/health-risk', optionalAuth, async (req, res) => {
    const startTime = Date.now();
    
    try {
        console.log('❤️ Health risk prediction request received');
        console.log('User:', req.user ? req.user.email : 'Anonymous');

        // Forward request to FastAPI
        const response = await fetch(`${FASTAPI_BASE_URL}/api/predictions/health-risk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('FastAPI error:', response.status, errorText);
            return res.status(response.status).json({
                success: false,
                message: 'Prediction service error',
                error: errorText
            });
        }

        const result = await response.json();
        const processingTime = Date.now() - startTime;

        // Save to database if user is authenticated
        if (req.user) {
            await savePrediction(req.user._id, 'health-risk', req.body, result, processingTime);
        }

        // Return the result
        res.json({
            success: true,
            ...result,
            processingTime: `${processingTime}ms`,
            saved: !!req.user // Indicates if prediction was saved to history
        });

    } catch (error) {
        console.error('❌ Health risk prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get user's prediction history
router.get('/history', authenticateUser, async (req, res) => {
    try {
        await connectDB();

        const { page = 1, limit = 10, type } = req.query;
        const skip = (page - 1) * limit;

        // Build query
        const query = { userId: req.user._id };
        if (type && ['migraine', 'health-risk'].includes(type)) {
            query.predictionType = type;
        }

        // Get predictions with pagination
        const predictions = await Prediction.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Prediction.countDocuments(query);

        res.json({
            success: true,
            data: {
                predictions: predictions.map(p => ({
                    id: p._id,
                    type: p.predictionType,
                    result: p.result.prediction,
                    confidence: p.result.confidence,
                    riskLevel: p.result.riskLevel,
                    description: p.result.description,
                    recommendations: p.result.recommendations,
                    date: p.createdAt,
                    formattedDate: new Date(p.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: skip + predictions.length < total,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching prediction history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prediction history',
            error: error.message
        });
    }
});

// Get user's prediction statistics
router.get('/stats', authenticateUser, async (req, res) => {
    try {
        await connectDB();

        // Get basic stats
        const stats = await Prediction.getUserStats(req.user._id);
        
        // Get recent predictions for timeline
        const recentPredictions = await Prediction.getRecentPredictions(req.user._id, 5);

        // Get risk level distribution for health predictions
        const healthRiskDistribution = await Prediction.aggregate([
            { 
                $match: { 
                    userId: req.user._id,
                    predictionType: 'health-risk',
                    'result.riskLevel': { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$result.riskLevel',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get migraine type distribution
        const migraneTypeDistribution = await Prediction.aggregate([
            { 
                $match: { 
                    userId: req.user._id,
                    predictionType: 'migraine',
                    'result.prediction': { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$result.prediction',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get prediction trend (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const predictionTrend = await Prediction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    types: { $addToSet: "$predictionType" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalPredictions: stats.totalPredictions,
                    migrainePredictions: stats.migrainePredictions,
                    healthRiskPredictions: stats.healthRiskPredictions,
                    averageConfidence: Math.round(stats.avgConfidence || 0),
                    lastPrediction: stats.lastPrediction
                },
                recentPredictions: recentPredictions.map(p => ({
                    id: p._id,
                    type: p.predictionType,
                    result: p.result.prediction,
                    confidence: p.result.confidence,
                    date: p.createdAt
                })),
                distributions: {
                    healthRisk: healthRiskDistribution,
                    migraneTypes: migraneTypeDistribution
                },
                trend: predictionTrend
            }
        });

    } catch (error) {
        console.error('❌ Error fetching prediction stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prediction statistics',
            error: error.message
        });
    }
});

// Delete a prediction from history
router.delete('/history/:id', authenticateUser, async (req, res) => {
    try {
        await connectDB();

        const prediction = await Prediction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id // Ensure user can only delete their own predictions
        });

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found or you do not have permission to delete it'
            });
        }

        res.json({
            success: true,
            message: 'Prediction deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting prediction:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting prediction',
            error: error.message
        });
    }
});

// Clear all prediction history for user
router.delete('/history', authenticateUser, async (req, res) => {
    try {
        await connectDB();

        const result = await Prediction.deleteMany({ userId: req.user._id });

        res.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} predictions from your history`
        });

    } catch (error) {
        console.error('❌ Error clearing prediction history:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing prediction history',
            error: error.message
        });
    }
});

module.exports = router;
