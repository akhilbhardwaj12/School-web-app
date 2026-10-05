// =====================================================
// School Management System - Vercel API Server
// =====================================================

require("dotenv").config();

// =====================================================
// Register Mongoose Models
// =====================================================

require("./src/models/user.model.js");
require("./src/models/class.model.js");
require("./src/models/guardian.model.js");
require("./src/models/student.model.js");
require("./src/models/teacher.model.js");

// =====================================================
// Dependencies
// =====================================================

const express = require("express");
const cors = require("cors");

// =====================================================
// Database
// =====================================================

const connectDB = require("./src/config/database.js");

// =====================================================
// Routes
// =====================================================

const studentRoutes = require("./src/routes/student.routes.js");
const teacherRoutes = require("./src/routes/teacher.route.js");
const classRoutes = require("./src/routes/class.routes.js");
const attendanceRoutes = require("./src/routes/attendance.routes.js");

// =====================================================
// App
// =====================================================

const app = express();

// =====================================================
// Middleware
// =====================================================

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// =====================================================
// Database Middleware
// =====================================================

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message,
        });
    }
});

// =====================================================
// Test Route
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "School Management API is running",
    });
});

// =====================================================
// Student Routes
// =====================================================

app.use("/api/students", studentRoutes);

// =====================================================
// Teacher Routes
// =====================================================

app.use("/api/teachers", teacherRoutes);

// =====================================================
// Class Routes
// =====================================================

app.use("/api/classes", classRoutes);

// =====================================================
// Attendance Routes
// =====================================================

app.use("/api/attendance", attendanceRoutes);

// =====================================================
// 404 Handler
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.originalUrl}`,
    });
});

// =====================================================
// Error Handler
// =====================================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// =====================================================
// IMPORTANT FOR VERCEL
// Do NOT use app.listen()
// =====================================================

module.exports = app;