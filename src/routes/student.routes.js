// =====================================================
// Student Routes
// School Management System
// =====================================================

const express = require("express");

const router = express.Router();

// =====================================================
// Student Controller
// =====================================================

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    activateStudent,
    deactivateStudent,
} = require("../controllers/admin/student.controller.js");

// =====================================================
// GET ALL STUDENTS
// GET /api/students
// =====================================================

router.get("/", getStudents);

// =====================================================
// GET STUDENT BY ID
// GET /api/students/:id
// =====================================================

router.get("/:id", getStudentById);

// =====================================================
// CREATE STUDENT
// POST /api/students
// =====================================================

router.post("/", createStudent);

// =====================================================
// UPDATE STUDENT
// PUT /api/students/:id
// =====================================================

router.put("/:id", updateStudent);

// =====================================================
// OPTIONAL UPDATE SUPPORT
// PATCH /api/students/:id
// =====================================================

router.patch("/:id", updateStudent);

// =====================================================
// DELETE STUDENT
// DELETE /api/students/:id
// =====================================================

router.delete("/:id", deleteStudent);

// =====================================================
// ACTIVATE STUDENT
// PATCH /api/students/:id/activate
// =====================================================

router.patch("/:id/activate", activateStudent);

// =====================================================
// DEACTIVATE STUDENT
// PATCH /api/students/:id/deactivate
// =====================================================

router.patch("/:id/deactivate", deactivateStudent);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;