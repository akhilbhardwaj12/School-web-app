// =====================================================
// Class Controller
// School Management System
// =====================================================

const mongoose = require("mongoose");
const ClassModel = require("../../models/class.model.js");

// =====================================================
// CREATE CLASS
// POST /api/classes
// =====================================================

const createClass = async (req, res, next) => {
    try {
        const {
            className,
            classCode,
            description,
            grade,
            section,
            academicYear,
            roomNumber,
            capacity,
            isActive
        } = req.body;

        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (!className || !classCode) {
            return res.status(400).json({
                success: false,
                message: "Class name and class code are required"
            });
        }

        // -------------------------------------------------
        // Check duplicate
        // -------------------------------------------------

        const existingClass = await ClassModel.findOne({
            $or: [
                {
                    className: className.trim()
                },
                {
                    classCode: classCode.trim().toUpperCase()
                }
            ]
        });

        if (existingClass) {
            return res.status(409).json({
                success: false,
                message: "Class name or class code already exists"
            });
        }

        // -------------------------------------------------
        // Create class
        // -------------------------------------------------

        const newClass = await ClassModel.create({
            className: className.trim(),

            classCode: classCode
                .trim()
                .toUpperCase(),

            description:
                description?.trim() || "",

            grade:
                grade !== undefined &&
                grade !== ""
                    ? Number(grade)
                    : null,

            section:
                section?.trim() || "",

            academicYear:
                academicYear?.trim() || "",

            roomNumber:
                roomNumber?.trim() || "",

            capacity:
                capacity !== undefined &&
                capacity !== ""
                    ? Number(capacity)
                    : 0,

            isActive:
                isActive !== undefined
                    ? Boolean(isActive)
                    : true,

            createdBy:
                req.admin?._id || undefined
        });

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass
        });

    } catch (error) {
        console.error(
            "Create class error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET ALL CLASSES
// GET /api/classes
// =====================================================

const getClasses = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            academicYear,
            section,
            isActive
        } = req.query;

        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------

        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                Number(limit) || 10,
                1
            ),
            100
        );

        const skip =
            (pageNumber - 1) *
            limitNumber;

        // -------------------------------------------------
        // Query
        // -------------------------------------------------

        const query = {};

        // Search
        if (search?.trim()) {
            query.$or = [
                {
                    className: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    classCode: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    section: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ];
        }

        // Academic year
        if (academicYear) {
            query.academicYear =
                academicYear;
        }

        // Section
        if (section) {
            query.section = section;
        }

        // Active status
        if (isActive !== undefined) {
            query.isActive =
                isActive === "true";
        }

        // -------------------------------------------------
        // Get classes
        // -------------------------------------------------

        const [classes, total] =
            await Promise.all([
                ClassModel
                    .find(query)
                    .sort({
                        className: 1
                    })
                    .skip(skip)
                    .limit(limitNumber),

                ClassModel.countDocuments(query)
            ]);

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Classes fetched successfully",

            data: classes,

            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,

                totalPages:
                    Math.ceil(
                        total /
                        limitNumber
                    )
            }
        });

    } catch (error) {
        console.error(
            "Get classes error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET CLASS BY ID
// GET /api/classes/:id
// =====================================================

const getClassById = async (
    req,
    res,
    next
) => {
    try {
        const { id } =
            req.params;

        // -------------------------------------------------
        // Validate ObjectId
        // -------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        // -------------------------------------------------
        // Find class
        // -------------------------------------------------

        const classData =
            await ClassModel.findById(id);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Class fetched successfully",

            data: classData
        });

    } catch (error) {
        console.error(
            "Get class by ID error:",
            error
        );

        next(error);
    }
};


// =====================================================
// UPDATE CLASS
// PUT /api/classes/:id
// =====================================================

const updateClass = async (
    req,
    res,
    next
) => {
    try {
        const { id } =
            req.params;

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const {
            className,
            classCode,
            description,
            grade,
            section,
            academicYear,
            roomNumber,
            capacity,
            isActive
        } = req.body;

        // -------------------------------------------------
        // Find class
        // -------------------------------------------------

        const classData =
            await ClassModel.findById(id);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // -------------------------------------------------
        // Check duplicate name/code
        // -------------------------------------------------

        if (className || classCode) {

            const duplicateQuery = {
                _id: {
                    $ne: id
                },
                $or: []
            };

            if (className) {
                duplicateQuery.$or.push({
                    className:
                        className.trim()
                });
            }

            if (classCode) {
                duplicateQuery.$or.push({
                    classCode:
                        classCode
                            .trim()
                            .toUpperCase()
                });
            }

            const duplicate =
                await ClassModel.findOne(
                    duplicateQuery
                );

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Class name or class code already exists"
                });
            }
        }

        // -------------------------------------------------
        // Update fields
        // -------------------------------------------------

        if (
            className !== undefined
        ) {
            classData.className =
                className.trim();
        }

        if (
            classCode !== undefined
        ) {
            classData.classCode =
                classCode
                    .trim()
                    .toUpperCase();
        }

        if (
            description !== undefined
        ) {
            classData.description =
                description.trim();
        }

        if (
            grade !== undefined
        ) {
            classData.grade =
                grade === ""
                    ? null
                    : Number(grade);
        }

        if (
            section !== undefined
        ) {
            classData.section =
                section.trim();
        }

        if (
            academicYear !== undefined
        ) {
            classData.academicYear =
                academicYear.trim();
        }

        if (
            roomNumber !== undefined
        ) {
            classData.roomNumber =
                roomNumber.trim();
        }

        if (
            capacity !== undefined
        ) {
            classData.capacity =
                capacity === ""
                    ? 0
                    : Number(capacity);
        }

        if (
            isActive !== undefined
        ) {
            classData.isActive =
                Boolean(isActive);
        }

        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        const updatedClass =
            await classData.save();

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Class updated successfully",

            data: updatedClass
        });

    } catch (error) {
        console.error(
            "Update class error:",
            error
        );

        next(error);
    }
};


// =====================================================
// DELETE CLASS
// DELETE /api/classes/:id
// =====================================================

const deleteClass = async (
    req,
    res,
    next
) => {
    try {
        const { id } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const classData =
            await ClassModel.findByIdAndDelete(
                id
            );

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Class deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete class error:",
            error
        );

        next(error);
    }
};


// =====================================================
// ACTIVATE CLASS
// PATCH /api/classes/:id/activate
// =====================================================

const activateClass = async (
    req,
    res,
    next
) => {
    try {
        const { id } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const classData =
            await ClassModel.findByIdAndUpdate(
                id,
                {
                    isActive: true
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!classData) {
            return res.status(404).json({
                success: false,
                message:
                    "Class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Class activated successfully",

            data: classData
        });

    } catch (error) {
        console.error(
            "Activate class error:",
            error
        );

        next(error);
    }
};


// =====================================================
// DEACTIVATE CLASS
// PATCH /api/classes/:id/deactivate
// =====================================================

const deactivateClass = async (
    req,
    res,
    next
) => {
    try {
        const { id } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const classData =
            await ClassModel.findByIdAndUpdate(
                id,
                {
                    isActive: false
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!classData) {
            return res.status(404).json({
                success: false,
                message:
                    "Class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Class deactivated successfully",

            data: classData
        });

    } catch (error) {
        console.error(
            "Deactivate class error:",
            error
        );

        next(error);
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
    activateClass,
    deactivateClass
};