// =====================================================
// User Controller
// =====================================================
// =====================================================
// User Controller
// =====================================================

const bcrypt = require('bcryptjs');

const UserModel = require('../../models/user.model.js');

const {
    generatePassword,
} = require('../../utils/generatePassword.js');

const {
    sendEmail,
} = require('../../utils/Mailer.js');

const {
    getFullName,
    sanitizeUser,
} = require('../../utils/userHelper.js');

// =====================================================
// Create User
// =====================================================

const createUser = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            role,
            address,
            isActive = true,
        } = req.body;

        if (!firstName || !lastName || !email || !role) {
            return res.status(400).json({
                success: false,
                message:
                    'First name, last name, email and role are required',
            });
        }

        const allowedRoles = [
            'admin',
            'teacher',
            'student',
            'parent',
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user role',
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await UserModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        const temporaryPassword = generatePassword(10);

        const hashedPassword = await bcrypt.hash(
            temporaryPassword,
            12
        );

        const user = await UserModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            phone,
            password: hashedPassword,
            role,
            address,
            isActive,
        });

        // Send login credentials
        try {
            await sendEmail({
                to: user.email,
                subject: 'Your School Management System Account',
                text: `
Hello ${getFullName(user)},

Your account has been created successfully.

Email: ${user.email}
Temporary Password: ${temporaryPassword}
Role: ${user.role}

Please login and change your password after your first login.

Regards,
School Management System
                `,
                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                    ">
                        <h2>
                            School Management System
                        </h2>

                        <p>
                            Hello
                            <strong>${getFullName(user)}</strong>,
                        </p>

                        <p>
                            Your account has been created successfully.
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${user.email}
                            <br>

                            <strong>Temporary Password:</strong>
                            ${temporaryPassword}
                            <br>

                            <strong>Role:</strong>
                            ${user.role}
                        </p>

                        <p>
                            Please change your password after
                            your first login.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>
                                School Management System
                            </strong>
                        </p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error(
                'User created but email failed:',
                emailError.message
            );
        }

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: sanitizeUser(user),
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get All Users
// =====================================================

const getUsers = async (req, res, next) => {
    try {
        const {
            role,
            isActive,
            search,
        } = req.query;

        const filter = {};

        if (role) {
            filter.role = role;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (search) {
            filter.$or = [
                {
                    firstName: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    lastName: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ];
        }

        const users = await UserModel.find(filter)
            .select(
                '-password -resetPasswordToken -resetPasswordExpires'
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get User By ID
// =====================================================

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id)
            .select(
                '-password -resetPasswordToken -resetPasswordExpires'
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update User
// =====================================================

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const allowedFields = [
            'firstName',
            'lastName',
            'phone',
            'address',
            'role',
            'isActive',
        ];

        if (req.body.role) {
            const allowedRoles = [
                'admin',
                'teacher',
                'student',
                'parent',
            ];

            if (!allowedRoles.includes(req.body.role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user role',
                });
            }
        }

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: sanitizeUser(user),
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Delete User
// =====================================================

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await UserModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Activate User
// =====================================================

const activateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findByIdAndUpdate(
            id,
            {
                isActive: true,
            },
            {
                new: true,
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User activated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Deactivate User
// =====================================================

const deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findByIdAndUpdate(
            id,
            {
                isActive: false,
            },
            {
                new: true,
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Change User Password
// =====================================================

const changeUserPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    'Current password and new password are required',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    'New password must be at least 6 characters',
            });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        user.password = await bcrypt.hash(
            newPassword,
            12
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Reset User Password By Admin
// =====================================================

const resetUserPassword = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const temporaryPassword = generatePassword(10);

        user.password = await bcrypt.hash(
            temporaryPassword,
            12
        );

        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset - School Management System',
                text: `
Hello ${getFullName(user)},

Your password has been reset by the administrator.

Temporary Password: ${temporaryPassword}

Please login and change your password immediately.

Regards,
School Management System
                `,
                html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2>Password Reset</h2>

                        <p>
                            Hello
                            <strong>${getFullName(user)}</strong>,
                        </p>

                        <p>
                            Your password has been reset by
                            the administrator.
                        </p>

                        <p>
                            <strong>
                                Temporary Password:
                            </strong>
                            ${temporaryPassword}
                        </p>

                        <p>
                            Please login and change your
                            password immediately.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>
                                School Management System
                            </strong>
                        </p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error(
                'Password reset email failed:',
                emailError.message
            );
        }

        return res.status(200).json({
            success: true,
            message: 'User password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Export Controllers
// =====================================================

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    changeUserPassword,
    resetUserPassword,
};