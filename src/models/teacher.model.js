// =====================================================
// Teacher Model
// School Management System
// =====================================================

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        // =================================================
        // Linked User Account
        // =================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // =================================================
        // Teacher Information
        // =================================================

        qualification: {
            type: String,
            trim: true,
            default: "",
            maxlength: [
                150,
                "Qualification cannot exceed 150 characters",
            ],
        },

        specialization: {
            type: String,
            trim: true,
            default: "",
            maxlength: [
                150,
                "Specialization cannot exceed 150 characters",
            ],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// =====================================================
// Register Model
// =====================================================

const TeacherModel =
    mongoose.models.Teacher ||
    mongoose.model("Teacher", teacherSchema);

module.exports = TeacherModel;