const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided or invalid format.'
            });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Get user from database
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is valid but user not found.'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account has been deactivated.'
                });
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (tokenError) {
            if (tokenError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please login again.'
                });
            } else if (tokenError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. Please login again.'
                });
            } else {
                throw tokenError;
            }
        }

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
};

// Optional middleware - doesn't require authentication but will add user if token is valid
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without user
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            } else {
                req.user = null;
            }
        } catch (tokenError) {
            // Invalid token, continue without user
            req.user = null;
        }

        next();

    } catch (error) {
        console.error('Optional auth middleware error:', error);
        req.user = null;
        next();
    }
};

// Middleware to check if user has specific role
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions.'
            });
        }

        next();
    };
};

module.exports = {
    authenticateUser,
    optionalAuth,
    requireRole
};
