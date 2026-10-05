const jwt = require('jsonwebtoken');
const AdminModel = require('../models/admin.model.js');
const ENV = require('../config/env.js');

const adminProtector = async (req, res, next) => {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Not authorized. No token provided'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Not authorized. No token provided'
            });
        }

        // Verify token
        let decoded;

        try {
            decoded = jwt.verify(token, ENV.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: 'Not authorized. Invalid or expired token'
            });
        }

        // Find admin from database
        const admin = await AdminModel.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({
                message: 'Not authorized. Admin not found'
            });
        }

        // Check admin status
        if (admin.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only'
            });
        }

        // Attach admin to request
        req.admin = admin;

        // Continue to next middleware/controller
        next();

    } catch (error) {
        console.error('Admin authentication error:', error);

        return res.status(500).json({
            message: 'Server error during authentication'
        });
    }
};

module.exports = adminProtector;