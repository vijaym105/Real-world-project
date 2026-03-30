const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require('cors');
const dotenv     = require("dotenv");

const authRoutes       = require("./routes/auth");
const statsRoutes      = require("./routes/stats");
const workoutRoutes    = require("./routes/workouts");
const attendanceRoutes = require("./routes/attendance");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ───────────────────────────────────────────────────────────────────
// Explicitly list allowed origins so it works even if .env is missing
const allowedOrigins = [
  "http://localhost:5173",   // Vite default
  "http://localhost:5174",   // Vite fallback port
  "http://localhost:3001",   // just in case
  process.env.CLIENT_URL,    // from .env
].filter(Boolean);           // remove undefined if CLIENT_URL not set

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight OPTIONS requests for all routes
app.options("*", cors());

// ─── Body Parser ────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/stats",      statsRoutes);
app.use("/api/workouts",   workoutRoutes);
app.use("/api/attendance", attendanceRoutes);

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", port: PORT });
});

// ─── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

// ─── Connect to MongoDB Atlas → start server ────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
