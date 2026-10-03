const { Schema, model } = require("mongoose");

const complaintSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Complaint title must be less than 100 characters"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Complaint description must be less than 1000 characters"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Academic",
        "Teacher",
        "Student",
        "Infrastructure",
        "Discipline",
        "Technical",
        "Other",
      ],
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    response: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Response must be less than 1000 characters"],
    },

    resolvedAt: {
      type: Date,
      default: null,
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

module.exports = model("Complaint", complaintSchema);