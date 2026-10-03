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
        origin: true,
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// =====================================================
// DATABASE MIDDLEWARE
// =====================================================
// Vercel runs this Express app as a serverless function.
// MongoDB connection is established before API requests.

app.use("/api", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

// =====================================================
// ROOT / TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "School Management API is running",
    });
});

// =====================================================
// API HEALTH CHECK
// =====================================================

app.get("/api/health", async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "School Management API is healthy",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// =====================================================
// STUDENT ROUTES
// =====================================================

app.use(
    "/api/students",
    studentRoutes
);

// =====================================================
// TEACHER ROUTES
// =====================================================

app.use(
    "/api/teachers",
    teacherRoutes
);

// =====================================================
// CLASS ROUTES
// =====================================================

app.use(
    "/api/classes",
    classRoutes
);

// =====================================================
// ATTENDANCE ROUTES
// =====================================================

app.use(
    "/api/attendance",
    attendanceRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.originalUrl}`,
    });
});

// =====================================================
// ERROR HANDLER
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
// EXPORT APP FOR VERCEL
// =====================================================

module.exports = app;

// =====================================================
// LOCAL DEVELOPMENT SERVER
// =====================================================

if (require.main === module) {

    const PORT =
        process.env.PORT || 5000;

    connectDB()
        .then(() => {

            app.listen(
                PORT,
                () => {

                    console.log(
                        `Server running on http://localhost:${PORT}`
                    );

                }
            );

        })
        .catch((error) => {

            console.error(
                "Server startup failed:",
                error.message
            );

            process.exit(1);

        });
}