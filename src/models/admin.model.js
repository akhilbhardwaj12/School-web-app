const { Schema, model } = require('mongoose');

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'First name must be less than 50 characters'],
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Last name must be less than 50 characters'],
    },

    photo: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'Password must be 8 characters long'],
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [100, 'Email must be less than 100 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: [15, 'Phone number must be less than 15 characters'],
    },

    role: {
      type: String,
      enum: {
        values: ['admin', 'superadmin'],
        message: 'Role must be either admin or superadmin',
      },
      default: 'admin',
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

const Admin = model('Admin', adminSchema);

module.exports = Admin;