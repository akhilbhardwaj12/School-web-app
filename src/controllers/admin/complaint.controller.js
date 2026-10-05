const ComplaintModel = require('../../models/complaint.model.js');

// =====================================================
// Create Complaint
// =====================================================

const createComplaint = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            student,
            guardian
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: 'Title and description are required'
            });
        }

        const complaint = await ComplaintModel.create({
            title,
            description,
            category,
            priority,
            student,
            guardian,
            status: 'pending',
            createdBy: req.admin._id
        });

        return res.status(201).json({
            success: true,
            message: 'Complaint created successfully',
            complaint
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get All Complaints
// =====================================================

const getComplaints = async (req, res, next) => {
    try {
        const {
            status,
            priority,
            category,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (category) {
            filter.category = category;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const complaints = await ComplaintModel
            .find(filter)
            .populate('student')
            .populate('guardian')
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await ComplaintModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            count: complaints.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            complaints
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Complaint By ID
// =====================================================

const getComplaintById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const complaint = await ComplaintModel
            .findById(id)
            .populate('student')
            .populate('guardian')
            .populate('createdBy', 'firstName lastName email');

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update Complaint
// =====================================================

const updateComplaint = async (req, res, next) => {
    try {
        const { id } = req.params;

        const complaint = await ComplaintModel.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('student')
            .populate('guardian')
            .populate('createdBy', 'firstName lastName email');

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Complaint updated successfully',
            complaint
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Delete Complaint
// =====================================================

const deleteComplaint = async (req, res, next) => {
    try {
        const { id } = req.params;

        const complaint = await ComplaintModel.findByIdAndDelete(id);

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Complaint deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update Complaint Status
// =====================================================

const updateComplaintStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            'pending',
            'in-progress',
            'resolved',
            'rejected'
        ];

        if (!status) {
            return res.status(400).json({
                message: 'Status is required'
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid complaint status',
                allowedStatuses
            });
        }

        const complaint = await ComplaintModel.findByIdAndUpdate(
            id,
            {
                status,
                resolvedAt: status === 'resolved'
                    ? new Date()
                    : null
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully',
            complaint
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Assign Complaint
// =====================================================

const assignComplaint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        if (!assignedTo) {
            return res.status(400).json({
                message: 'assignedTo is required'
            });
        }

        const complaint = await ComplaintModel.findByIdAndUpdate(
            id,
            {
                assignedTo,
                status: 'in-progress'
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Complaint assigned successfully',
            complaint
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus,
    assignComplaint
};