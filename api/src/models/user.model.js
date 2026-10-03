// =====================================================
// User Model
// School Management System
// =====================================================

const mongoose = require("mongoose");

// =====================================================
// User Schema
// =====================================================

const userSchema = new mongoose.Schema(
    {
        // =================================================
        // Basic Information
        // =================================================

        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        // =================================================
        // Authentication
        // =================================================

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: [
                "admin",
                "teacher",
                "student",
                "guardian",
            ],
            default: "student",
        },

        // =================================================
        // Personal Information
        // =================================================

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: undefined,
        },

        dateOfBirth: {
            type: Date,
            default: undefined,
        },

        // =================================================
        // Address
        // =================================================

        address: {
            street: {
                type: String,
                default: "",
                trim: true,
            },
        },

        // =================================================
        // Account Status
        // =================================================

        isActive: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        // =================================================
        // Password Reset
        // =================================================

        resetPasswordToken: {
            type: String,
            default: undefined,
        },

        resetPasswordExpires: {
            type: Date,
            default: undefined,
        },

        // =================================================
        // Email Verification
        // =================================================

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        emailVerificationToken: {
            type: String,
            default: undefined,
        },

        emailVerificationExpires: {
            type: Date,
            default: undefined,
        },

        // =================================================
        // Login
        // =================================================

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// =====================================================
// NORMALIZE EMAIL
// Mongoose 9 compatible
// =====================================================

userSchema.pre("save", function () {
    if (this.email) {
        this.email = this.email
            .toLowerCase()
            .trim();
    }
});

// =====================================================
// HIDE SENSITIVE FIELDS
// =====================================================

userSchema.methods.toJSON = function () {
    const user = this.toObject();

    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpires;

    return user;
};

// =====================================================
// REGISTER MODEL
// =====================================================

const UserModel =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

// =====================================================
// EXPORT
// =====================================================

module.exports = UserModel;
module.exports.UserModel = UserModel;