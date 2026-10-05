// =====================================================
// School Management System - API Server
// Vercel Serverless Configuration
// =====================================================

// =====================================================
// Environment Variables
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
// Database Connection Middleware
// =====================================================

let dbConnected = false;

app.use(async (req, res, next) => {
    try {
        if (!dbConnected) {
            await connectDB();
            dbConnected = true;
            console.log("MongoDB connected successfully");
        }

        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error);

        return res.status(500).json({
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
// Health Check
// =====================================================

app.get("/api", (req, res) => {
    res.status(200).json({
        success: true,
        message: "School Management API is running",
        routes: {
            students: "/api/students",
            teachers: "/api/teachers",
            classes: "/api/classes",
            attendance: "/api/attendance",
        },
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
// Local Server + Vercel
// =====================================================

const PORT = process.env.PORT || 5000;

// Start server only when running directly with Node.js
// Vercel will use module.exports instead.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });
}

// =====================================================
// Export Express App for Vercel
// =====================================================

module.exports = app;