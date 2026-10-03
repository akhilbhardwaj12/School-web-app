// =====================================================
// Class Routes
// School Management System
// =====================================================

const express = require("express");

const router = express.Router();

// =====================================================
// Controller
// =====================================================

const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
    activateClass,
    deactivateClass,
} = require("../controllers/admin/class.controller.js");

// =====================================================
// GET ALL CLASSES
// GET /api/classes
// =====================================================

router.get("/", getClasses);

// =====================================================
// CREATE CLASS
// POST /api/classes
// =====================================================

router.post("/", createClass);

// =====================================================
// GET SINGLE CLASS
// GET /api/classes/:id
// =====================================================

router.get("/:id", getClassById);

// =====================================================
// UPDATE CLASS
// PUT /api/classes/:id
// =====================================================

router.put("/:id", updateClass);

// =====================================================
// DELETE CLASS
// DELETE /api/classes/:id
// =====================================================

router.delete("/:id", deleteClass);

// =====================================================
// ACTIVATE CLASS
// PATCH /api/classes/:id/activate
// =====================================================

router.patch("/:id/activate", activateClass);

// =====================================================
// DEACTIVATE CLASS
// PATCH /api/classes/:id/deactivate
// =====================================================

router.patch("/:id/deactivate", deactivateClass);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;