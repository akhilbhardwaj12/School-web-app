// =====================================================
// User Authentication Middleware
// =====================================================

const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model.js');

// =====================================================
// Protect User Routes
// =====================================================

const userProtector = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await UserModel.findById(decoded.id)
            .select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check active status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive',
            });
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Authentication token has expired',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
        }

        next(error);
    }
};

// =====================================================
// Role Authorization Middleware
// =====================================================

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }

        next();
    };
};

// =====================================================
// Admin Only
// =====================================================

const adminOnly = authorizeRoles('admin');

// =====================================================
// Teacher Only
// =====================================================

const teacherOnly = authorizeRoles('teacher');

// =====================================================
// Student Only
// =====================================================

const studentOnly = authorizeRoles('student');

// =====================================================
// Parent / Guardian Only
// =====================================================

const parentOnly = authorizeRoles('parent');

// =====================================================
// Admin or Teacher
// =====================================================

const adminOrTeacher = authorizeRoles(
    'admin',
    'teacher'
);

// =====================================================
// Admin or Parent
// =====================================================

const adminOrParent = authorizeRoles(
    'admin',
    'parent'
);

// =====================================================
// Admin, Teacher or Parent
// =====================================================

const adminTeacherOrParent = authorizeRoles(
    'admin',
    'teacher',
    'parent'
);

// =====================================================
// Export Middleware
// =====================================================

module.exports = {
    userProtector,
    authorizeRoles,
    adminOnly,
    teacherOnly,
    studentOnly,
    parentOnly,
    adminOrTeacher,
    adminOrParent,
    adminTeacherOrParent,
};