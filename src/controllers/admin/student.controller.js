// =====================================================
// Student Controller
// School Management System
// =====================================================

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// =====================================================
// Models
// =====================================================

const StudentModel = require("../../models/student.model.js");

const {
    UserModel,
} = require("../../models/user.model.js");

// =====================================================
// Generate Password
// =====================================================

const generatePassword = (length = 10) => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return password;
};

// =====================================================
// CREATE STUDENT
// POST /api/students
// =====================================================

const createStudent = async (req, res, next) => {
    try {
        const {
            admissionNumber,
            firstName,
            lastName,
            email,
            phone,
            classId,
            dateOfBirth,
            gender,
            address,
            status,
        } = req.body;

        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (!firstName || !firstName.trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required",
            });
        }

        if (!lastName || !lastName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Last name is required",
            });
        }

        if (
            !admissionNumber ||
            !admissionNumber.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Admission number is required",
            });
        }

        // -------------------------------------------------
        // Check Admission Number
        // -------------------------------------------------

        const existingStudent =
            await StudentModel.findOne({
                admissionNumber:
                    admissionNumber.trim(),
            });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message:
                    "Admission number already exists",
            });
        }

        // -------------------------------------------------
        // Check Email
        // -------------------------------------------------

        if (email && email.trim()) {
            const existingUser =
                await UserModel.findOne({
                    email: email
                        .trim()
                        .toLowerCase(),
                });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Email already exists",
                });
            }
        }

        // -------------------------------------------------
        // Validate Class
        // -------------------------------------------------

        if (
            classId &&
            !mongoose.Types.ObjectId.isValid(
                classId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID",
            });
        }

        // -------------------------------------------------
        // Generate Password
        // -------------------------------------------------

        const temporaryPassword =
            generatePassword(10);

        const hashedPassword =
            await bcrypt.hash(
                temporaryPassword,
                10
            );

        // -------------------------------------------------
        // Create User
        // -------------------------------------------------

        const user = await UserModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email
                ? email.trim().toLowerCase()
                : undefined,
            phone: phone
                ? phone.trim()
                : undefined,
            password: hashedPassword,
            role: "student",
        });

        // -------------------------------------------------
        // Create Student
        // -------------------------------------------------

        const student =
            await StudentModel.create({
                user: user._id,

                admissionNumber:
                    admissionNumber.trim(),

                firstName:
                    firstName.trim(),

                lastName:
                    lastName.trim(),

                email: email
                    ? email.trim().toLowerCase()
                    : undefined,

                phone: phone
                    ? phone.trim()
                    : undefined,

                class: classId || undefined,

                dateOfBirth:
                    dateOfBirth || undefined,

                gender:
                    gender || undefined,

                address:
                    address
                        ? address.trim()
                        : undefined,

                status:
                    status === "Inactive"
                        ? "Inactive"
                        : "Active",
            });

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        const result =
            await StudentModel.findById(
                student._id
            )
                .populate(
                    "user",
                    "firstName lastName email phone"
                )
                .populate(
                    "class",
                    "className classCode grade academicYear"
                )
                .populate("guardian");

        return res.status(201).json({
            success: true,
            message:
                "Student created successfully",
            data: result,
            temporaryPassword,
        });
    } catch (error) {
        console.error(
            "Create student error:",
            error
        );

        next(error);
    }
};

// =====================================================
// GET ALL STUDENTS
// GET /api/students
// =====================================================

const getStudents = async (req, res, next) => {
    try {
        const students =
            await StudentModel.find()
                .populate(
                    "user",
                    "firstName lastName email phone"
                )
                .populate(
                    "class",
                    "className classCode grade academicYear"
                )
                .populate("guardian")
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });
    } catch (error) {
        console.error(
            "Get students error:",
            error
        );

        next(error);
    }
};

// =====================================================
// GET STUDENT BY ID
// GET /api/students/:id
// =====================================================

const getStudentById = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const student =
            await StudentModel.findById(id)
                .populate(
                    "user",
                    "firstName lastName email phone"
                )
                .populate(
                    "class",
                    "className classCode grade academicYear"
                )
                .populate("guardian");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        console.error(
            "Get student error:",
            error
        );

        next(error);
    }
};

// =====================================================
// UPDATE STUDENT
// PUT /api/students/:id
// =====================================================

const updateStudent = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        // -------------------------------------------------
        // Validate Student ID
        // -------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        // -------------------------------------------------
        // Find Student
        // -------------------------------------------------

        const student =
            await StudentModel.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // -------------------------------------------------
        // Request Data
        // -------------------------------------------------

        const {
            firstName,
            lastName,
            phone,
            classId,
            dateOfBirth,
            gender,
            address,
            status,
            isActive,
        } = req.body;

        // -------------------------------------------------
        // Validate Class ID
        // -------------------------------------------------

        if (
            classId &&
            !mongoose.Types.ObjectId.isValid(
                classId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID",
            });
        }

        // -------------------------------------------------
        // Update First Name
        // -------------------------------------------------

        if (firstName !== undefined) {
            student.firstName =
                firstName.trim();
        }

        // -------------------------------------------------
        // Update Last Name
        // -------------------------------------------------

        if (lastName !== undefined) {
            student.lastName =
                lastName.trim();
        }

        // -------------------------------------------------
        // Update Phone
        // -------------------------------------------------

        if (phone !== undefined) {
            student.phone =
                phone.trim();
        }

        // -------------------------------------------------
        // Update Class
        // -------------------------------------------------

        if (classId !== undefined) {
            student.class =
                classId || null;
        }

        // -------------------------------------------------
        // Update Date Of Birth
        // -------------------------------------------------

        if (dateOfBirth !== undefined) {
            student.dateOfBirth =
                dateOfBirth || null;
        }

        // -------------------------------------------------
        // Update Gender
        // -------------------------------------------------

        if (gender !== undefined) {
            student.gender =
                gender || undefined;
        }

        // -------------------------------------------------
        // Update Address
        // -------------------------------------------------

        if (address !== undefined) {
            student.address =
                address.trim();
        }

        // -------------------------------------------------
        // Update Status
        // -------------------------------------------------

        if (status !== undefined) {
            if (
                ![
                    "Active",
                    "Inactive",
                ].includes(status)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Status must be Active or Inactive",
                });
            }

            student.status = status;
        }

        // -------------------------------------------------
        // Support isActive
        // -------------------------------------------------

        if (isActive !== undefined) {
            student.status = isActive
                ? "Active"
                : "Inactive";
        }

        // -------------------------------------------------
        // Save Student
        // -------------------------------------------------

        await student.save();

        // -------------------------------------------------
        // Update Related User
        // -------------------------------------------------

        if (student.user) {
            const userUpdate = {};

            if (firstName !== undefined) {
                userUpdate.firstName =
                    firstName.trim();
            }

            if (lastName !== undefined) {
                userUpdate.lastName =
                    lastName.trim();
            }

            if (phone !== undefined) {
                userUpdate.phone =
                    phone.trim();
            }

            if (
                Object.keys(userUpdate).length >
                0
            ) {
                await UserModel.findByIdAndUpdate(
                    student.user,
                    userUpdate,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            }
        }

        // -------------------------------------------------
        // Fetch Updated Student
        // -------------------------------------------------

        const updatedStudent =
            await StudentModel.findById(id)
                .populate(
                    "user",
                    "firstName lastName email phone"
                )
                .populate(
                    "class",
                    "className classCode grade academicYear"
                )
                .populate("guardian");

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Student updated successfully",
            data: updatedStudent,
        });
    } catch (error) {
        console.error(
            "Update student error:",
            error
        );

        next(error);
    }
};

// =====================================================
// DELETE STUDENT
// DELETE /api/students/:id
// =====================================================

const deleteStudent = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const student =
            await StudentModel.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Delete related user
        if (student.user) {
            await UserModel.findByIdAndDelete(
                student.user
            );
        }

        // Delete student
        await StudentModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message:
                "Student deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete student error:",
            error
        );

        next(error);
    }
};

// =====================================================
// ACTIVATE STUDENT
// PATCH /api/students/:id/activate
// =====================================================

const activateStudent = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const student =
            await StudentModel.findByIdAndUpdate(
                id,
                {
                    status: "Active",
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Student activated successfully",
            data: student,
        });
    } catch (error) {
        console.error(
            "Activate student error:",
            error
        );

        next(error);
    }
};

// =====================================================
// DEACTIVATE STUDENT
// PATCH /api/students/:id/deactivate
// =====================================================

const deactivateStudent = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const student =
            await StudentModel.findByIdAndUpdate(
                id,
                {
                    status: "Inactive",
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Student deactivated successfully",
            data: student,
        });
    } catch (error) {
        console.error(
            "Deactivate student error:",
            error
        );

        next(error);
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    activateStudent,
    deactivateStudent,
};