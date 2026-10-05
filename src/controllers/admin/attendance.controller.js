// =====================================================
// Attendance Controller
// School Management System
// =====================================================

const mongoose = require("mongoose");

const AttendanceModel = require("../../models/attendance.model.js");
const StudentModel = require("../../models/student.model.js");

// =====================================================
// MARK ATTENDANCE
// POST /api/attendance
// =====================================================

const markAttendance = async (req, res) => {
    try {
        const {
            student,
            date,
            status,
            remarks,
        } = req.body;

        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required",
            });
        }

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required",
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Attendance status is required",
            });
        }

        // -------------------------------------------------
        // Validate ObjectId
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        // -------------------------------------------------
        // Check Student
        // -------------------------------------------------

        const studentExists =
            await StudentModel.findById(student);

        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // -------------------------------------------------
        // Validate Status
        // -------------------------------------------------

        const allowedStatuses = [
            "Present",
            "Absent",
            "Leave",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be Present, Absent or Leave",
            });
        }

        // -------------------------------------------------
        // Create Date
        // -------------------------------------------------

        const attendanceDate = new Date(date);

        if (isNaN(attendanceDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance date",
            });
        }

        attendanceDate.setHours(0, 0, 0, 0);

        // -------------------------------------------------
        // Create / Update Attendance
        // -------------------------------------------------

        const attendance =
            await AttendanceModel.findOneAndUpdate(
                {
                    student: student,
                    date: attendanceDate,
                },
                {
                    student: student,
                    date: attendanceDate,
                    status: status,
                    remarks: remarks || "",
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            result: attendance,
        });
    } catch (error) {
        console.error(
            "MARK ATTENDANCE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message,
        });
    }
};

// =====================================================
// GET ATTENDANCE
// GET /api/attendance
// =====================================================

const getAttendance = async (req, res) => {
    try {
        const {
            date,
            student,
        } = req.query;

        const filter = {};

        // -------------------------------------------------
        // Student Filter
        // -------------------------------------------------

        if (student) {
            if (!mongoose.Types.ObjectId.isValid(student)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID",
                });
            }

            filter.student = student;
        }

        // -------------------------------------------------
        // Date Filter
        // -------------------------------------------------

        if (date) {
            const startDate = new Date(date);

            if (isNaN(startDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date",
                });
            }

            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(startDate);

            endDate.setHours(
                23,
                59,
                59,
                999
            );

            filter.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        // -------------------------------------------------
        // Get Attendance
        // -------------------------------------------------

        const attendance =
            await AttendanceModel.find(filter)
                .populate(
                    "student",
                    "user class emergencyContact"
                )
                .sort({
                    date: -1,
                });

        return res.status(200).json({
            success: true,
            count: attendance.length,
            result: attendance,
        });
    } catch (error) {
        console.error(
            "GET ATTENDANCE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message,
        });
    }
};

// =====================================================
// GET ATTENDANCE BY ID
// GET /api/attendance/:id
// =====================================================

const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const attendance =
            await AttendanceModel.findById(id)
                .populate(
                    "student",
                    "user class emergencyContact"
                );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        return res.status(200).json({
            success: true,
            result: attendance,
        });
    } catch (error) {
        console.error(
            "GET ATTENDANCE BY ID ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message,
        });
    }
};

// =====================================================
// UPDATE ATTENDANCE
// PUT /api/attendance/:id
// =====================================================

const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            remarks,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const allowedStatuses = [
            "Present",
            "Absent",
            "Leave",
        ];

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be Present, Absent or Leave",
            });
        }

        const attendance =
            await AttendanceModel.findByIdAndUpdate(
                id,
                {
                    ...(status && { status }),
                    ...(remarks !== undefined && {
                        remarks,
                    }),
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            result: attendance,
        });
    } catch (error) {
        console.error(
            "UPDATE ATTENDANCE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update attendance",
            error: error.message,
        });
    }
};

// =====================================================
// DELETE ATTENDANCE
// DELETE /api/attendance/:id
// =====================================================

const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const attendance =
            await AttendanceModel.findByIdAndDelete(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Attendance deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE ATTENDANCE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete attendance",
            error: error.message,
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    markAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
};