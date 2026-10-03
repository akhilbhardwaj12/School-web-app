const AnnouncementModel = require('../../models/announcement.model.js');

// =====================================================
// Create Announcement
// =====================================================

const createAnnouncement = async (req, res, next) => {
    try {
        const {
            title,
            content,
            description,
            audience,
            priority,
            publishDate,
            expiryDate,
            isPublished
        } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        // Create announcement
        const announcement = await AnnouncementModel.create({
            title: title.trim(),
            content: content.trim(),
            description: description?.trim() || '',
            audience: audience || 'all',
            priority: priority || 'normal',
            publishDate: publishDate || new Date(),
            expiryDate: expiryDate || null,
            isPublished: isPublished ?? false,
            createdBy: req.admin._id
        });

        return res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            announcement
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get All Announcements
// =====================================================

const getAnnouncements = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            audience,
            priority,
            isPublished
        } = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

        const skip = (pageNumber - 1) * limitNumber;

        // Build query
        const query = {};

        // Search
        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    content: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }

        // Audience filter
        if (audience) {
            query.audience = audience;
        }

        // Priority filter
        if (priority) {
            query.priority = priority;
        }

        // Published filter
        if (isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }

        const [announcements, total] = await Promise.all([
            AnnouncementModel
                .find(query)
                .populate('createdBy', 'firstName lastName email')
                .sort({
                    publishDate: -1,
                    createdAt: -1
                })
                .skip(skip)
                .limit(limitNumber),

            AnnouncementModel.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            announcements,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber)
            }
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Single Announcement
// =====================================================

const getAnnouncementById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const announcement = await AnnouncementModel
            .findById(id)
            .populate(
                'createdBy',
                'firstName lastName email'
            );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        return res.status(200).json({
            success: true,
            announcement
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update Announcement
// =====================================================

const updateAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            content,
            description,
            audience,
            priority,
            publishDate,
            expiryDate,
            isPublished
        } = req.body;

        const announcement = await AnnouncementModel.findById(id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Update only provided fields
        if (title !== undefined) {
            announcement.title = title.trim();
        }

        if (content !== undefined) {
            announcement.content = content.trim();
        }

        if (description !== undefined) {
            announcement.description = description.trim();
        }

        if (audience !== undefined) {
            announcement.audience = audience;
        }

        if (priority !== undefined) {
            announcement.priority = priority;
        }

        if (publishDate !== undefined) {
            announcement.publishDate = publishDate;
        }

        if (expiryDate !== undefined) {
            announcement.expiryDate = expiryDate;
        }

        if (isPublished !== undefined) {
            announcement.isPublished = isPublished;
        }

        const updatedAnnouncement =
            await announcement.save();

        return res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            announcement: updatedAnnouncement
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Delete Announcement
// =====================================================

const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const announcement =
            await AnnouncementModel.findByIdAndDelete(id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Publish Announcement
// =====================================================

const publishAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const announcement =
            await AnnouncementModel.findByIdAndUpdate(
                id,
                {
                    isPublished: true,
                    publishDate: new Date()
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Announcement published successfully',
            announcement
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Unpublish Announcement
// =====================================================

const unpublishAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const announcement =
            await AnnouncementModel.findByIdAndUpdate(
                id,
                {
                    isPublished: false
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Announcement unpublished successfully',
            announcement
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Published Announcements
// =====================================================

const getPublishedAnnouncements = async (req, res, next) => {
    try {
        const announcements = await AnnouncementModel
            .find({
                isPublished: true,
                $or: [
                    {
                        expiryDate: null
                    },
                    {
                        expiryDate: {
                            $gte: new Date()
                        }
                    }
                ]
            })
            .sort({
                priority: -1,
                publishDate: -1
            });

        return res.status(200).json({
            success: true,
            count: announcements.length,
            announcements
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    unpublishAnnouncement,
    getPublishedAnnouncements
};