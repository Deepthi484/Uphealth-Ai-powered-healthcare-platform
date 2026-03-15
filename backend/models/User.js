const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        // More flexible phone validation - allows empty strings and various formats
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty phone numbers
                // Allow various phone formats
                return /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        required: [true, 'Gender is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password in queries by default
    },
    agreeToTerms: {
        type: Boolean,
        required: [true, 'You must agree to the terms of service'],
        default: false
    },
    agreeToPrivacy: {
        type: Boolean,
        required: [true, 'You must agree to the privacy policy'],
        default: false
    },
    agreeToMarketing: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'healthcare_provider'],
        default: 'user'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance (email index is already created by unique: true)
userSchema.index({ phone: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user's full name
userSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

// Method to get user's age
userSchema.methods.getAge = function() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Virtual for user's age
userSchema.virtual('age').get(function() {
    return this.getAge();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
