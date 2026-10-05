const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================================
    // STUDENT INFORMATION
    // =====================================================
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    // =====================================================
    // CLASS
    // =====================================================
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },

    // =====================================================
    // GUARDIAN
    // =====================================================
    guardian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guardian",
      default: null,
    },

    // =====================================================
    // STATUS
    // =====================================================
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// MODEL
// =====================================================

const StudentModel =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

module.exports = StudentModel;