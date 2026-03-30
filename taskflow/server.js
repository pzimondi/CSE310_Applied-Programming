/**
 * server.js — TaskFlow Entry Point
 *
 * Sets up the Express web server, connects to MongoDB via Mongoose,
 * wires up middleware (CORS, JSON parsing, static files), and mounts
 * the task routes. The server only starts listening once the database
 * connection is confirmed — this prevents requests arriving before
 * the database is ready.
 *
 * Author: Pastor Munashe Zimondi
 * Module: Web Apps — CSE 310
 */

// Load environment variables from .env into process.env
// Must be called before anything that reads process.env
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const path     = require("path");

const taskRoutes = require("./routes/tasks");

// Create the Express application
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Allow the browser to make fetch() calls without CORS errors
app.use(cors());

// Parse JSON bodies from incoming POST/PATCH requests
app.use(express.json());

// Serve the public/ folder as static files
// index.html, about.html, css/, js/ are all accessible directly
app.use(express.static(path.join(__dirname, "public")));

// ─── API Routes ───────────────────────────────────────────────────────────────

// All /tasks endpoints are handled by the tasks router
app.use("/tasks", taskRoutes);

// ─── Stats Route (used by about.html to show live data) ───────────────────────

const Task = require("./models/Task");

/**
 * GET /stats
 * Returns a live summary of the task collection from MongoDB.
 * The about.html page fetches this on load to display real numbers.
 */
app.get("/stats", async (req, res) => {
  try {
    const total     = await Task.countDocuments();
    const completed = await Task.countDocuments({ completed: true });
    const pending   = total - completed;
    const latest    = await Task.findOne().sort({ createdAt: -1 }).select("title createdAt");
    res.json({ total, completed, pending, latest });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch stats." });
  }
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────

// Any request that doesn't match a route or static file gets the 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// ─── Connect to MongoDB, then Start Server ────────────────────────────────────

/**
 * Connect to MongoDB first, only start listening once connection is confirmed.
 * If connection fails, print a clear error and exit.
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("\n  ✅  Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`  ✅  TaskFlow is running!`);
      console.log(`  🌐  Open your browser at: http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    console.error("\n  ❌  MongoDB connection failed:", err.message);
    console.error("  👉  Check your MONGO_URI in the .env file\n");
    process.exit(1);
  });