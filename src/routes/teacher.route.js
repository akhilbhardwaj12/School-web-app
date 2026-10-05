const express = require("express");

const router = express.Router();

const {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
} = require("../controllers/admin/teacher.controller.js");

// =====================================================
// Teacher Routes
// =====================================================

// GET all teachers
router.get("/", getTeachers);

// GET teacher by ID
router.get("/:id", getTeacherById);

// CREATE teacher
router.post("/", createTeacher);

// UPDATE teacher
router.put("/:id", updateTeacher);

// DELETE teacher
router.delete("/:id", deleteTeacher);

module.exports = router;