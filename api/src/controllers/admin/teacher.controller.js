// =====================================================
// Teacher Controller
// School Management System
// =====================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// =====================================================
// Models
// =====================================================

const TeacherModel = require("../../models/teacher.model.js");
const UserModel = require("../../models/user.model.js");

// =====================================================
// Helper - Generate Temporary Password
// =====================================================

const generateTemporaryPassword = () => {
    return crypto.randomBytes(4).toString("hex");
};

// =====================================================
// Helper - Populate Teacher
// =====================================================

const populateTeacher = (query) => {
    return query.populate({
        path: "user",
        select:
            "-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires",
    });
};

// =====================================================
// CREATE TEACHER
// POST /api/teachers
// =====================================================

const createTeacher = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth,
            address,
            qualification,
            specialization,
        } = req.body;

        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message:
                    "First name, last name and email are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // -------------------------------------------------
        // Check existing user
        // -------------------------------------------------

        const existingUser = await UserModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this email already exists",
            });
        }

        // -------------------------------------------------
        // Generate temporary password
        // -------------------------------------------------

        const temporaryPassword =
            generateTemporaryPassword();

        const hashedPassword = await bcrypt.hash(
            temporaryPassword,
            10
        );

        // -------------------------------------------------
        // Create User
        // -------------------------------------------------

        const user = await UserModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            phone: phone || "",
            gender: gender
                ? gender.toLowerCase().trim()
                : undefined,
            dateOfBirth: dateOfBirth || undefined,

            address: {
                street:
                    typeof address === "string"
                        ? address
                        : address?.street || "",
            },

            password: hashedPassword,

            role: "teacher",

            isActive: true,
            isDeleted: false,
        });

        // -------------------------------------------------
        // Create Teacher
        // -------------------------------------------------

        const teacher = await TeacherModel.create({
            user: user._id,
            qualification: qualification || "",
            specialization: specialization || "",
            isActive: true,
        });

        // -------------------------------------------------
        // Populate User
        // -------------------------------------------------

        const populatedTeacher =
            await populateTeacher(
                TeacherModel.findById(teacher._id)
            );

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            result: populatedTeacher,

            // Temporary password only for development
            temporaryPassword,
        });
    } catch (error) {
        console.error(
            "Create teacher error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create teacher",
        });
    }
};

// =====================================================
// GET ALL TEACHERS
// GET /api/teachers
// =====================================================

const getTeachers = async (req, res) => {
    try {
        const teachers = await populateTeacher(
            TeacherModel.find({})
        ).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: teachers.length,
            result: teachers,
        });
    } catch (error) {
        console.error(
            "Get teachers error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch teachers",
        });
    }
};

// =====================================================
// GET TEACHER BY ID
// GET /api/teachers/:id
// =====================================================

const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }

        // -------------------------------------------------
        // Find teacher
        // -------------------------------------------------

        const teacher = await populateTeacher(
            TeacherModel.findById(id)
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        return res.status(200).json({
            success: true,
            result: teacher,
        });
    } catch (error) {
        console.error(
            "Get teacher by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch teacher",
        });
    }
};

// =====================================================
// UPDATE TEACHER
// PUT /api/teachers/:id
// =====================================================

const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth,
            address,
            qualification,
            specialization,
            isActive,
        } = req.body;

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }

        // -------------------------------------------------
        // Find teacher
        // -------------------------------------------------

        const teacher =
            await TeacherModel.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        // -------------------------------------------------
        // Find linked User
        // -------------------------------------------------

        const user =
            await UserModel.findById(
                teacher.user
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "Linked user account not found",
            });
        }

        // =================================================
        // UPDATE TEACHER DATA
        // =================================================

        if (qualification !== undefined) {
            teacher.qualification =
                qualification.trim();
        }

        if (specialization !== undefined) {
            teacher.specialization =
                specialization.trim();
        }

        if (isActive !== undefined) {
            teacher.isActive = Boolean(isActive);
        }

        // =================================================
        // UPDATE USER DATA
        // =================================================

        if (firstName !== undefined) {
            user.firstName =
                firstName.trim();
        }

        if (lastName !== undefined) {
            user.lastName =
                lastName.trim();
        }

        if (email !== undefined) {
            const normalizedEmail =
                email.toLowerCase().trim();

            const emailExists =
                await UserModel.findOne({
                    email: normalizedEmail,
                    _id: { $ne: user._id },
                });

            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Email is already being used by another user",
                });
            }

            user.email = normalizedEmail;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        if (gender !== undefined) {
            user.gender = gender;
        }

        if (dateOfBirth !== undefined) {
            user.dateOfBirth = dateOfBirth;
        }

        if (address !== undefined) {
            user.address = {
                street:
                    typeof address === "string"
                        ? address
                        : address?.street || "",
            };
        }

        if (isActive !== undefined) {
            user.isActive =
                Boolean(isActive);
        }

        // -------------------------------------------------
        // Save both documents
        // -------------------------------------------------

        await teacher.save();
        await user.save();

        // -------------------------------------------------
        // Return updated teacher
        // -------------------------------------------------

        const updatedTeacher =
            await populateTeacher(
                TeacherModel.findById(id)
            );

        return res.status(200).json({
            success: true,
            message:
                "Teacher updated successfully",
            result: updatedTeacher,
        });
    } catch (error) {
        console.error(
            "Update teacher error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update teacher",
        });
    }
};

// =====================================================
// DELETE TEACHER
// DELETE /api/teachers/:id
// =====================================================

const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }

        // -------------------------------------------------
        // Find teacher
        // -------------------------------------------------

        const teacher =
            await TeacherModel.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        // -------------------------------------------------
        // Store linked user ID
        // -------------------------------------------------

        const userId = teacher.user;

        // -------------------------------------------------
        // Delete ONLY selected teacher
        // -------------------------------------------------

        await TeacherModel.findByIdAndDelete(id);

        // -------------------------------------------------
        // Delete ONLY linked user
        // -------------------------------------------------

        if (userId) {
            await UserModel.findByIdAndDelete(
                userId
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Teacher deleted successfully",
            deletedTeacherId: id,
        });
    } catch (error) {
        console.error(
            "Delete teacher error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete teacher",
        });
    }
};

// =====================================================
// ACTIVATE TEACHER
// PATCH /api/teachers/:id/activate
// =====================================================

const activateTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }

        const teacher =
            await TeacherModel.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        teacher.isActive = true;
        await teacher.save();

        if (teacher.user) {
            await UserModel.findByIdAndUpdate(
                teacher.user,
                {
                    isActive: true,
                    isDeleted: false,
                }
            );
        }

        const updatedTeacher =
            await populateTeacher(
                TeacherModel.findById(id)
            );

        return res.status(200).json({
            success: true,
            message:
                "Teacher activated successfully",
            result: updatedTeacher,
        });
    } catch (error) {
        console.error(
            "Activate teacher error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to activate teacher",
        });
    }
};

// =====================================================
// DEACTIVATE TEACHER
// PATCH /api/teachers/:id/deactivate
// =====================================================

const deactivateTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }

        const teacher =
            await TeacherModel.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        teacher.isActive = false;
        await teacher.save();

        if (teacher.user) {
            await UserModel.findByIdAndUpdate(
                teacher.user,
                {
                    isActive: false,
                }
            );
        }

        const updatedTeacher =
            await populateTeacher(
                TeacherModel.findById(id)
            );

        return res.status(200).json({
            success: true,
            message:
                "Teacher deactivated successfully",
            result: updatedTeacher,
        });
    } catch (error) {
        console.error(
            "Deactivate teacher error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to deactivate teacher",
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    activateTeacher,
    deactivateTeacher,
};