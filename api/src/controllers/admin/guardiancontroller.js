// =====================================================
// Guardian Controller
// =====================================================

const bcrypt = require('bcryptjs');

const GuardianModel = require('../../models/guardian.model.js');

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
// Create Guardian
// =====================================================

const createGuardian = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            children = [],
        } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name and email are required',
            });
        }

        const existingGuardian = await GuardianModel.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingGuardian) {
            return res.status(409).json({
                success: false,
                message: 'Guardian with this email already exists',
            });
        }

        const temporaryPassword = generatePassword(10);

        const hashedPassword = await bcrypt.hash(
            temporaryPassword,
            12
        );

        const guardian = await GuardianModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone,
            address,
            children,
            password: hashedPassword,
            role: 'parent',
            isActive: true,
        });

        try {
            await sendEmail({
                to: guardian.email,
                subject: 'Your Guardian Account',

                text: `
Hello ${getFullName(guardian)},

Your guardian account has been created successfully.

Email: ${guardian.email}
Temporary Password: ${temporaryPassword}

Please login and change your password after your first login.

Regards,
School Management System
                `,

                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                        <h2>Guardian Account Created</h2>

                        <p>
                            Hello <strong>${getFullName(guardian)}</strong>,
                        </p>

                        <p>
                            Your guardian account has been created successfully.
                        </p>

                        <p>
                            <strong>Email:</strong> ${guardian.email}<br>
                            <strong>Temporary Password:</strong>
                            ${temporaryPassword}
                        </p>

                        <p>
                            Please change your password after your first login.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>School Management System</strong>
                        </p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error(
                'Guardian created but email failed:',
                emailError.message
            );
        }

        return res.status(201).json({
            success: true,
            message: 'Guardian created successfully',
            data: sanitizeUser(guardian),
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get All Guardians
// =====================================================

const getGuardians = async (req, res, next) => {
    try {
        const guardians = await GuardianModel.find()
            .select(
                '-password -resetPasswordToken -resetPasswordExpires'
            )
            .populate(
                'children',
                'firstName lastName email classId'
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: guardians.length,
            data: guardians,
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Guardian By ID
// =====================================================

const getGuardianById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const guardian = await GuardianModel.findById(id)
            .select(
                '-password -resetPasswordToken -resetPasswordExpires'
            )
            .populate(
                'children',
                'firstName lastName email classId'
            );

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: guardian,
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update Guardian
// =====================================================

const updateGuardian = async (req, res, next) => {
    try {
        const { id } = req.params;

        const guardian = await GuardianModel.findById(id);

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        const allowedFields = [
            'firstName',
            'lastName',
            'phone',
            'address',
            'children',
            'isActive',
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                guardian[field] = req.body[field];
            }
        });

        await guardian.save();

        return res.status(200).json({
            success: true,
            message: 'Guardian updated successfully',
            data: sanitizeUser(guardian),
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Delete Guardian
// =====================================================

const deleteGuardian = async (req, res, next) => {
    try {
        const { id } = req.params;

        const guardian = await GuardianModel.findById(id);

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        await GuardianModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Guardian deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Activate Guardian
// =====================================================

const activateGuardian = async (req, res, next) => {
    try {
        const { id } = req.params;

        const guardian = await GuardianModel.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        ).select('-password');

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Guardian activated successfully',
            data: guardian,
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Deactivate Guardian
// =====================================================

const deactivateGuardian = async (req, res, next) => {
    try {
        const { id } = req.params;

        const guardian = await GuardianModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Guardian deactivated successfully',
            data: guardian,
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Add Child To Guardian
// =====================================================

const addChild = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required',
            });
        }

        const guardian = await GuardianModel.findById(id);

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        const alreadyExists = guardian.children.some(
            childId =>
                childId.toString() === studentId.toString()
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: 'Student is already linked to this guardian',
            });
        }

        guardian.children.push(studentId);

        await guardian.save();

        return res.status(200).json({
            success: true,
            message: 'Student linked to guardian successfully',
            data: sanitizeUser(guardian),
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Remove Child From Guardian
// =====================================================

const removeChild = async (req, res, next) => {
    try {
        const { id, studentId } = req.params;

        const guardian = await GuardianModel.findById(id);

        if (!guardian) {
            return res.status(404).json({
                success: false,
                message: 'Guardian not found',
            });
        }

        guardian.children = guardian.children.filter(
            childId =>
                childId.toString() !== studentId.toString()
        );

        await guardian.save();

        return res.status(200).json({
            success: true,
            message: 'Student removed from guardian successfully',
            data: sanitizeUser(guardian),
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Export Controllers
// =====================================================

module.exports = {
    createGuardian,
    getGuardians,
    getGuardianById,
    updateGuardian,
    deleteGuardian,
    activateGuardian,
    deactivateGuardian,
    addChild,
    removeChild,
};