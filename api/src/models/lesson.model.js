const { Schema, model } = require('mongoose');

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Subject cannot exceed 50 characters'],
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Topic cannot exceed 200 characters'],
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    objectives: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length <= 20 &&
            value.every(
              (item) =>
                typeof item === 'string' &&
                item.trim().length > 0 &&
                item.length <= 500
            )
          );
        },
        message: 'Objectives must contain up to 20 non-empty strings',
      },
    },

    content: {
      type: String,
      trim: true,
      default: '',
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },

    materials: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length <= 10 &&
            value.every(
              (item) =>
                typeof item === 'string' &&
                item.trim().length > 0 &&
                item.length <= 500
            )
          );
        },
        message: 'Materials must be up to 10 non-empty file URL strings',
      },
    },

    lessonDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
      default: 60,
    },

    room: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Room cannot exceed 100 characters'],
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

// Indexes
lessonSchema.index({ teacher: 1, lessonDate: -1 });
lessonSchema.index({ class: 1, lessonDate: -1 });
lessonSchema.index({ course: 1, lessonDate: -1 });
lessonSchema.index({ subject: 1, lessonDate: -1 });

// Model
const LessonModel = model('Lesson', lessonSchema);

module.exports = LessonModel;