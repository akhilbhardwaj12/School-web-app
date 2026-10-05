const { Schema, model } = require('mongoose');

const attendanceSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        },

        lesson: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true
        },

        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            default: 'present',
            required: true
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        markedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher'
        },

        remarks: {
            type: String,
            trim: true,
            default: '',
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Attendance', attendanceSchema);