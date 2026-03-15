const express = require('express');
const User = require('../models/User');
const connectDB = require('../config/database');
const jwt = require('jsonwebtoken');

const router = express.Router();

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// User Registration (Signup)
router.post('/signup', async (req, res) => {
    try {
        // Connect to database
        await connectDB();

        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            gender,
            password,
            confirmPassword,
            agreeToTerms,
            agreeToPrivacy,
            agreeToMarketing
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !dateOfBirth || !gender || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Validate terms agreement
        if (!agreeToTerms || !agreeToPrivacy) {
            return res.status(400).json({
                success: false,
                message: 'You must agree to the terms of service and privacy policy'
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone: phone || '', // Handle empty phone
            dateOfBirth: new Date(dateOfBirth), // Convert string to Date object
            gender,
            password,
            agreeToTerms,
            agreeToPrivacy,
            agreeToMarketing
        });

        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    fullName: user.getFullName(),
                    age: user.getAge(),
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.log('Validation errors:', messages);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
                errors: messages
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        // Connect to database
        await connectDB();

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    fullName: user.getFullName(),
                    age: user.getAge(),
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get current user profile
router.get('/profile', async (req, res) => {
    try {
        // Connect to database
        await connectDB();

        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    dateOfBirth: user.dateOfBirth,
                    gender: user.gender,
                    fullName: user.getFullName(),
                    age: user.getAge(),
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Profile error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
