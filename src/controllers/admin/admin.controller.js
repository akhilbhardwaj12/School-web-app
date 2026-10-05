const AdminModel = require('../../models/admin.model.js');
const ENV = require('../../config/env.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../../config/cloudinary.js');
const { Readable } = require('stream');

// =====================================================
// Serialize Admin
// =====================================================

const serializeAdmin = (admin) => {
    const adminObject = admin.toObject();

    delete adminObject.password;

    return {
        id: adminObject._id,
        ...adminObject
    };
};

// =====================================================
// Upload Buffer to Cloudinary
// =====================================================

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'school-web-app/admins',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

// =====================================================
// Admin Login
// =====================================================

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const admin = await AdminModel
            .findOne({ email })
            .select('+password');

        if (!admin) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated. Contact support.'
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            ENV.JWT_SECRET,
            {
                expiresIn: ENV.JWT_EXPIRES_IN
            }
        );

        return res.status(200).json({
            message: 'Admin login successful',
            token,
            admin: serializeAdmin(admin)
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Current Admin
// =====================================================

const getMe = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            admin: serializeAdmin(req.admin)
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Change Password
// =====================================================

const changePassword = async (req, res, next) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    'Current password and new password are required'
            });
        }

        const admin = await AdminModel
            .findById(req.admin._id)
            .select('+password');

        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        admin.password = await bcrypt.hash(
            newPassword,
            12
        );

        await admin.save();

        return res.status(200).json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Admin Dashboard
// =====================================================

const getAdminDashboardStats = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Admin dashboard',
            admin: serializeAdmin(req.admin)
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update Admin Photo
// =====================================================

const updateMyPhoto = async (req, res, next) => {
    try {
        // Multer stores the uploaded image in req.file
        if (!req.file) {
            return res.status(400).json({
                message: 'Please upload a photo'
            });
        }

        // Upload image buffer to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer
        );

        // Save Cloudinary URL in MongoDB
        const admin = await AdminModel.findByIdAndUpdate(
            req.admin._id,
            {
                photo: result.secure_url
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile photo updated successfully',
            admin: serializeAdmin(admin)
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
    loginAdmin,
    getMe,
    changePassword,
    getAdminDashboardStats,
    updateMyPhoto
};