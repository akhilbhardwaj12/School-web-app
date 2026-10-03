// =====================================================
// server.js
// School Management System Backend
// =====================================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("node:path");

// =====================================================
// Load .env
// =====================================================

// server.js location:
// D:\school-web-app\api\src\server.js
//
// .env location:
// D:\school-web-app\api\.env
//
// Therefore we go one level up from src.

const envPath = path.resolve(__dirname, "../.env");

const result = dotenv.config({
  path: envPath,
});

if (result.error) {
  console.error("❌ Failed to load .env");
  console.error("Expected .env at:", envPath);
  process.exit(1);
}

console.log("✅ Environment loaded from:", envPath);

// =====================================================
// Environment Variables
// =====================================================

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

const NODE_ENV = process.env.NODE_ENV || "development";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const ADMIN_URL =
  process.env.ADMIN_URL || "http://localhost:5174";

// =====================================================
// Validate Environment
// =====================================================

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env");
  process.exit(1);
}

console.log("✅ MONGO_URI loaded");
console.log("✅ Frontend URL:", FRONTEND_URL);
console.log("✅ Admin URL:", ADMIN_URL);

// =====================================================
// Express App
// =====================================================

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  FRONTEND_URL,
  ADMIN_URL,
];

// Remove duplicate values
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log("----------------------------------------");
console.log("Allowed CORS Origins:");

uniqueOrigins.forEach((origin) => {
  console.log("✓", origin);
});

console.log("----------------------------------------");

// =====================================================
// CORS Middleware
// =====================================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, curl and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

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

    credentials: true,
  })
);

// =====================================================
// Body Parser
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// Request Logger
// =====================================================

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
  );

  next();
});

// =====================================================
// Basic Health Check
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management API is running",
    environment: NODE_ENV,
    port: PORT,
  });
});

// =====================================================
// API Health Check
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management API is healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    databaseName:
      mongoose.connection.readyState === 1
        ? mongoose.connection.name
        : null,
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// Student Routes
// =====================================================

try {
  const studentRoutes = require("./routes/student.routes.js");

  app.use("/api/students", studentRoutes);

  console.log("✅ Student routes loaded");
  console.log(
    `   GET http://localhost:${PORT}/api/students`
  );
} catch (error) {
  console.error("❌ Student routes failed to load:");
  console.error(error.message);
}

// =====================================================
// Teacher Routes
// =====================================================

try {
  const teacherRoutes = require("./routes/teacher.route.js");

  app.use("/api/teachers", teacherRoutes);

  console.log("✅ Teacher routes loaded");
} catch (error) {
  console.log(
    "⚠️ Teacher routes not loaded:",
    error.message
  );
}

// =====================================================
// User Routes
// =====================================================

try {
  const userRoutes = require("./routes/user.route.js");

  app.use("/api/users", userRoutes);

  console.log("✅ User routes loaded");
} catch (error) {
  console.log(
    "⚠️ User routes not loaded:",
    error.message
  );
}

// =====================================================
// Admin Routes
// =====================================================

try {
  const adminRoutes = require("./routes/admin.route.js");

  app.use("/api/admin", adminRoutes);

  console.log("✅ Admin routes loaded");
} catch (error) {
  console.log(
    "⚠️ Admin routes not loaded:",
    error.message
  );
}

// =====================================================
// 404 Handler
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// Global Error Handler
// =====================================================

app.use((err, req, res, next) => {
  console.error("========================================");
  console.error("❌ SERVER ERROR");
  console.error("========================================");

  console.error(err);

  // CORS error
  if (
    err.message &&
    err.message.startsWith("CORS blocked")
  ) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal Server Error",

    ...(NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

// =====================================================
// MongoDB Connection
// =====================================================

const connectDB = async () => {
  try {
    console.log("----------------------------------------");
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected successfully!");
    console.log(
      "✅ Database:",
      mongoose.connection.name
    );

    console.log("----------------------------------------");

    return true;
  } catch (error) {
    console.error("----------------------------------------");
    console.error("❌ MongoDB connection failed");
    console.error("----------------------------------------");

    console.error(error.message);

    return false;
  }
};

// =====================================================
// Start Server
// =====================================================

const startServer = async () => {
  const databaseConnected = await connectDB();

  if (!databaseConnected) {
    console.error(
      "❌ Server will not start because MongoDB connection failed."
    );

    process.exit(1);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("========================================");
    console.log("🚀 SCHOOL MANAGEMENT API");
    console.log("========================================");
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(
      `❤️ Health: http://localhost:${PORT}/api/health`
    );
    console.log(
      `👨‍🎓 Students: http://localhost:${PORT}/api/students`
    );
    console.log("========================================");
    console.log("✅ Server started successfully");
    console.log("========================================");
  });

  // ===================================================
  // Graceful Shutdown
  // ===================================================

  const shutdown = async (signal) => {
    console.log("");
    console.log(`${signal} received.`);
    console.log("Shutting down server...");

    server.close(async () => {
      try {
        await mongoose.connection.close();

        console.log("✅ MongoDB connection closed.");
        console.log("✅ Server stopped.");

        process.exit(0);
      } catch (error) {
        console.error(
          "❌ Error closing MongoDB:",
          error.message
        );

        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => {
    shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    shutdown("SIGTERM");
  });
};

// =====================================================
// Start Application
// =====================================================

startServer();