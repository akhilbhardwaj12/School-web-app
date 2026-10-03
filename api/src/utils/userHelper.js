// =====================================================
// User Helper Utility
// =====================================================

// Get user's full name
const getFullName = (user) => {
    if (!user) {
        return '';
    }

    return [user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
};

// Check if user is an admin
const isAdmin = (user) => {
    return user?.role === 'admin';
};

// Check if user is a teacher
const isTeacher = (user) => {
    return user?.role === 'teacher';
};

// Check if user is a student
const isStudent = (user) => {
    return user?.role === 'student';
};

// Check if user is a parent
const isParent = (user) => {
    return user?.role === 'parent';
};

// Check if user is active
const isActiveUser = (user) => {
    return Boolean(user && user.isActive);
};

// Check if user has a specific role
const hasRole = (user, role) => {
    if (!user || !role) {
        return false;
    }

    return user.role === role;
};

// Check if user has any of the given roles
const hasAnyRole = (user, roles = []) => {
    if (!user || !Array.isArray(roles)) {
        return false;
    }

    return roles.includes(user.role);
};

// Get user ID as string
const getUserId = (user) => {
    if (!user?._id) {
        return null;
    }

    return user._id.toString();
};

// Remove sensitive information before sending user data
const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const userObject =
        typeof user.toObject === 'function'
            ? user.toObject()
            : { ...user };

    delete userObject.password;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    delete userObject.__v;

    return userObject;
};

module.exports = {
    getFullName,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    isActiveUser,
    hasRole,
    hasAnyRole,
    getUserId,
    sanitizeUser,
};