const { Router } = require('express');

// =====================================================
// User Controller
// =====================================================

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    changeUserPassword,
    resetUserPassword,
}  = require('../controllers/users/user.controller.js');

// =====================================================
// Middleware
// =====================================================

const adminProtector = require('../middleware/admin.middleware.js');

const router = Router();

// =====================================================
// Protected Routes
// All user routes require Admin authentication
// =====================================================

router.use(adminProtector);

// =====================================================
// User Management
// =====================================================

// Create user
router.post(
    '/',
    createUser
);

// Get all users
router.get(
    '/',
    getUsers
);

// Get user by ID
router.get(
    '/:id',
    getUserById
);

// Update user
router.patch(
    '/:id',
    updateUser
);

// Delete user
router.delete(
    '/:id',
    deleteUser
);

// =====================================================
// User Status
// =====================================================

// Activate user
router.patch(
    '/:id/activate',
    activateUser
);

// Deactivate user
router.patch(
    '/:id/deactivate',
    deactivateUser
);

// =====================================================
// User Password
// =====================================================

// Change user password
router.patch(
    '/:id/password',
    changeUserPassword
);

// Reset user password
router.patch(
    '/:id/reset-password',
    resetUserPassword
);

// =====================================================
// Export Router
// =====================================================

module.exports = router;