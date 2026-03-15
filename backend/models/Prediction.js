const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    predictionType: {
        type: String,
        enum: ['migraine', 'health-risk'],
        required: [true, 'Prediction type is required']
    },
    inputData: {
        type: mongoose.Schema.Types.Mixed, // Stores the input parameters used for prediction
        required: [true, 'Input data is required']
    },
    result: {
        prediction: {
            type: mongoose.Schema.Types.Mixed, // Can be string or number
            required: [true, 'Prediction result is required']
        },
        confidence: {
            type: Number,
            required: [true, 'Confidence score is required'],
            min: 0,
            max: 100
        },
        predictionCode: {
            type: Number // For migraine predictions (0-6)
        },
        riskLevel: {
            type: String // High, Medium, Low, Normal
        },
        description: {
            type: String // Detailed description of the prediction
        },
        recommendations: [{
            type: String // Array of recommendations
        }],
        vitalSignsAnalysis: [{
            type: String // For health risk predictions
        }]
    },
    metadata: {
        apiVersion: {
            type: String,
            default: '1.0'
        },
        modelVersion: {
            type: String,
            default: 'v1.0'
        },
        processingTime: {
            type: Number // Time taken for prediction in milliseconds
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for better query performance
predictionSchema.index({ userId: 1, createdAt: -1 }); // For user's prediction history
predictionSchema.index({ userId: 1, predictionType: 1, createdAt: -1 }); // For filtered queries
predictionSchema.index({ createdAt: -1 }); // For admin queries

// Virtual for formatted date
predictionSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Virtual for relative time (e.g., "2 hours ago")
predictionSchema.virtual('relativeTime').get(function() {
    const now = new Date();
    const diffInMs = now - this.createdAt;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
        return this.formattedDate;
    }
});

// Method to get prediction summary
predictionSchema.methods.getSummary = function() {
    return {
        id: this._id,
        type: this.predictionType,
        result: this.result.prediction,
        confidence: this.result.confidence,
        riskLevel: this.result.riskLevel,
        date: this.formattedDate,
        relativeTime: this.relativeTime
    };
};

// Static method to get user's prediction stats
predictionSchema.statics.getUserStats = async function(userId) {
    const stats = await this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalPredictions: { $sum: 1 },
                migrainePredictions: {
                    $sum: { $cond: [{ $eq: ['$predictionType', 'migraine'] }, 1, 0] }
                },
                healthRiskPredictions: {
                    $sum: { $cond: [{ $eq: ['$predictionType', 'health-risk'] }, 1, 0] }
                },
                avgConfidence: { $avg: '$result.confidence' },
                lastPrediction: { $max: '$createdAt' }
            }
        }
    ]);

    return stats.length > 0 ? stats[0] : {
        totalPredictions: 0,
        migrainePredictions: 0,
        healthRiskPredictions: 0,
        avgConfidence: 0,
        lastPrediction: null
    };
};

// Static method to get recent predictions for a user
predictionSchema.statics.getRecentPredictions = async function(userId, limit = 10) {
    return await this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(); // Use lean() for better performance when we don't need full Mongoose documents
};

// Ensure virtual fields are serialized
predictionSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        // Don't include sensitive input data in API responses by default
        if (ret.inputData && ret.inputData.Patient_ID) {
            delete ret.inputData.Patient_ID;
        }
        return ret;
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);
