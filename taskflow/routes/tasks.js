/**
 * routes/tasks.js — Task API Endpoints (MongoDB version)
 *
 * All four REST endpoints talk to MongoDB via the Mongoose Task model.
 *
 *   GET    /tasks         → return all tasks from MongoDB
 *   POST   /tasks         → insert a new task document
 *   PATCH  /tasks/:id     → toggle completed on a document
 *   DELETE /tasks/:id     → remove a document permanently
 *
 * Author: Pastor Munashe Zimondi
 * Module: Web Apps — CSE 310
 */

const express = require("express");
const router  = express.Router();
const Task    = require("../models/Task");

// ─── GET /tasks ───────────────────────────────────────────────────────────────

/**
 * Retrieves all task documents from MongoDB, sorted newest first.
 * The browser calls this on page load to populate the task list.
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("GET /tasks error:", err.message);
    res.status(500).json({ error: "Failed to retrieve tasks." });
  }
});

// ─── POST /tasks ──────────────────────────────────────────────────────────────

/**
 * Creates and saves a new Task document in MongoDB.
 * Expects JSON body: { "title": "Buy milk", "priority": "low" }
 * Mongoose validates the data against the schema before saving.
 */
router.post("/", async (req, res) => {
  const { title, priority } = req.body;

  // Basic check before hitting the database
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Task title cannot be empty." });
  }

  try {
    const newTask = await Task.create({
      title:    title.trim(),
      priority: priority || "medium",
    });
    res.status(201).json(newTask);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    console.error("POST /tasks error:", err.message);
    res.status(500).json({ error: "Failed to create task." });
  }
});

// ─── PATCH /tasks/:id ─────────────────────────────────────────────────────────

/**
 * Toggles the completed field on a single task by its MongoDB _id.
 * Fetches the document, flips the boolean, saves it back.
 */
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Flip the completed flag and save
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid task ID format." });
    }
    console.error("PATCH /tasks/:id error:", err.message);
    res.status(500).json({ error: "Failed to update task." });
  }
});

// ─── DELETE /tasks/:id ────────────────────────────────────────────────────────

/**
 * Permanently removes a task document from MongoDB by its _id.
 * Returns 404 if no matching task is found.
 */
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid task ID format." });
    }
    console.error("DELETE /tasks/:id error:", err.message);
    res.status(500).json({ error: "Failed to delete task." });
  }
});

module.exports = router;