const { Schema, model } = require('mongoose');

const announcementSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [
                150,
                'Title must be less than 150 characters'
            ]
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: [
                2000,
                'Content must be less than 2000 characters'
            ]
        },

        category: {
            type: String,
            enum: [
                'general',
                'academic',
                'event',
                'exam',
                'holiday',
                'urgent'
            ],
            default: 'general'
        },

        targetAudience: {
            type: String,
            enum: [
                'all',
                'students',
                'teachers',
                'parents',
                'staff'
            ],
            default: 'all'
        },

        isPublished: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date,
            default: null
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const AnnouncementModel = model(
    'Announcement',
    announcementSchema
);

module.exports = AnnouncementModel;