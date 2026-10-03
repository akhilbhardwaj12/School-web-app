// =====================================================
// School Management System - API Server
// =====================================================
// =====================================================
// REGISTER MONGOOSE MODELS
// =====================================================

require("./src/models/user.model.js");
require("./src/models/class.model.js");
require("./src/models/guardian.model.js");
require("./src/models/student.model.js");
require("./src/models/teacher.model.js");
// =====================================================
// Environment Variables
// =====================================================

require("dotenv").config();

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
const attendanceRoutes = require(
    "./src/routes/attendance.routes.js"
);

// =====================================================
// App
// =====================================================

const app = express();

// =====================================================
// Middleware
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// =====================================================
// Test Route
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "School Management API is running",
    });
});

// =====================================================
// Student Routes
// =====================================================

app.use(
    "/api/students",
    studentRoutes
);

// =====================================================
// Teacher Routes
// =====================================================

app.use(
    "/api/teachers",
    teacherRoutes
);

// =====================================================
// Class Routes
// =====================================================

app.use(
    "/api/classes",
    classRoutes
);
// ====================================================
// Attendance Routes
//=====================================================

app.use(
    "/api/attendance",
    attendanceRoutes
);

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

app.use(
    (err, req, res, next) => {
        console.error(
            "Server Error:",
            err
        );

        res.status(
            err.statusCode || 500
        ).json({
            success: false,
            message:
                err.message ||
                "Internal Server Error",
        });
    }
);

// =====================================================
// Server
// =====================================================

const PORT =
    process.env.PORT || 5000;

// =====================================================
// Start Server
// =====================================================

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start Express only after DB connection
        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

// =====================================================
// Start Application
// =====================================================

startServer();