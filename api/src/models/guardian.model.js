const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema(
  {
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

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    relationship: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    occupation: {
      type: String,
      trim: true,
    },

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

// Prevent OverwriteModelError during nodemon restarts
const GuardianModel =
  mongoose.models.Guardian ||
  mongoose.model("Guardian", guardianSchema);

module.exports = GuardianModel;