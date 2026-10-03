// =====================================================
// Attendance Routes
// =====================================================

const express = require("express");

const router = express.Router();

const {
    markAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
} = require("../controllers/admin/attendance.controller.js");

// =====================================================
// GET ALL ATTENDANCE
// GET /api/attendance
// =====================================================

router.get("/", getAttendance);

// =====================================================
// GET ATTENDANCE BY ID
// GET /api/attendance/:id
// =====================================================

router.get("/:id", getAttendanceById);

// =====================================================
// MARK ATTENDANCE
// POST /api/attendance
// =====================================================

router.post("/", markAttendance);

// =====================================================
// UPDATE ATTENDANCE
// PUT /api/attendance/:id
// =====================================================

router.put("/:id", updateAttendance);

// =====================================================
// DELETE ATTENDANCE
// DELETE /api/attendance/:id
// =====================================================

router.delete("/:id", deleteAttendance);

module.exports = router;