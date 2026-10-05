const CourseModel = require('../../models/course.model.js');

// =====================================================
// Create Course
// =====================================================

const createCourse = async (req, res, next) => {
    try {
        const {
            courseName,
            courseCode,
            description,
            duration,
            fee,
            status
        } = req.body;

        if (!courseName || !courseCode) {
            return res.status(400).json({
                success: false,
                message: 'Course name and course code are required'
            });
        }

        const existingCourse = await CourseModel.findOne({
            $or: [
                { courseName },
                { courseCode }
            ]
        });

        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: 'Course name or course code already exists'
            });
        }

        const course = await CourseModel.create({
            courseName,
            courseCode,
            description,
            duration,
            fee,
            status: status || 'active',
            createdBy: req.admin._id
        });

        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get All Courses
// =====================================================

const getCourses = async (req, res, next) => {
    try {
        const {
            status,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                {
                    courseName: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    courseCode: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;

        const courses = await CourseModel
            .find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const total = await CourseModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            count: courses.length,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            courses
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Course By ID
// =====================================================

const getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await CourseModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        return res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Update Course
// =====================================================

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Delete Course
// =====================================================

const deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Activate Course
// =====================================================

const activateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findByIdAndUpdate(
            id,
            { status: 'active' },
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course activated successfully',
            course
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Deactivate Course
// =====================================================

const deactivateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course deactivated successfully',
            course
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    activateCourse,
    deactivateCourse
};