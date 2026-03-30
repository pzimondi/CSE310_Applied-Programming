/**
 * models/Task.js — Mongoose Task Schema
 *
 * This file defines the shape of a Task document in MongoDB.
 * Mongoose uses this schema to validate data before saving it,
 * and gives us a clean API (Task.find(), Task.create(), etc.)
 * instead of writing raw database queries.
 *
 * Author: Pastor Munashe Zimondi
 * Module: Web Apps — CSE 310
 */

const mongoose = require("mongoose");

/**
 * Task Schema
 * Defines the structure and validation rules for every task document.
 * MongoDB will enforce these rules automatically via Mongoose.
 */
const taskSchema = new mongoose.Schema(
  {
    // The task display text — required, trimmed, max 120 characters
    title: {
      type:      String,
      required:  [true, "Task title is required."],
      trim:      true,
      maxlength: [120, "Title cannot exceed 120 characters."],
    },

    // Priority level — only these three values are accepted
    priority: {
      type:    String,
      enum:    ["low", "medium", "high"],
      default: "medium",
    },

    // Whether the task has been marked complete
    completed: {
      type:    Boolean,
      default: false,
    },
  },
  {
    // Mongoose automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * Export the compiled model.
 * "Task" becomes the MongoDB collection name (stored as "tasks").
 */
module.exports = mongoose.model("Task", taskSchema);