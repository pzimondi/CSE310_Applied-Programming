/**
 * public/js/app.js — TaskFlow Client-Side Logic
 *
 * Runs in the browser. Responsible for:
 *   1. Fetching tasks from the REST API on page load
 *   2. Rendering the task list in the DOM
 *   3. Adding tasks via POST /tasks
 *   4. Toggling completion via PATCH /tasks/:id
 *   5. Deleting tasks via DELETE /tasks/:id
 *   6. Filtering the list (All / Pending / Done)
 *   7. Keeping sidebar stats in sync
 *
 * NOTE: MongoDB uses _id (not id) — always use task._id here.
 *
 * Author: Pastor Munashe Zimondi
 * Module: Web Apps — CSE 310
 */

const API_URL = "http://localhost:3000/tasks";

/** Local copy of all tasks from the server */
let tasks = [];

/** Current active filter: "all" | "pending" | "done" */
let currentFilter = "all";

// ─── DOM References ───────────────────────────────────────────────────────────
const taskList       = document.getElementById("task-list");
const taskInput      = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const addBtn         = document.getElementById("add-btn");
const formError      = document.getElementById("form-error");
const emptyState     = document.getElementById("empty-state");
const filterBtns     = document.querySelectorAll(".filter-btn");
const statTotal      = document.getElementById("stat-total");
const statDone       = document.getElementById("stat-done");
const statPending    = document.getElementById("stat-pending");

// ─── Network: Load All Tasks ──────────────────────────────────────────────────

/**
 * Calls GET /tasks and stores results in the local tasks array.
 * Called once on page load.
 */
async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    tasks = await response.json();
    renderTasks();
  } catch (err) {
    console.error("Failed to load tasks:", err);
    showError("Could not connect to the server. Is it running?");
  }
}

// ─── Network: Add a Task ──────────────────────────────────────────────────────

/**
 * Validates form input, then calls POST /tasks.
 * Prepends the returned task to the local array and re-renders.
 */
async function addTask() {
  const title    = taskInput.value.trim();
  const priority = prioritySelect.value;

  // Validate before hitting the network
  if (!title) {
    showError("Please enter a task title.");
    taskInput.focus();
    return;
  }
  clearError();

  try {
    const response = await fetch(API_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ title, priority }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to add task.");
    }

    const newTask = await response.json();
    tasks.unshift(newTask); // newest at top
    taskInput.value      = "";
    prioritySelect.value = "medium";
    renderTasks();
  } catch (err) {
    console.error("Error adding task:", err);
    showError(err.message);
  }
}

// ─── Network: Toggle Completion ───────────────────────────────────────────────

/**
 * Calls PATCH /tasks/:id to flip the completed flag on the server.
 * Updates the matching task in the local array with the server response.
 * @param {string} id - MongoDB _id of the task
 */
async function toggleTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "PATCH" });
    if (!response.ok) throw new Error("Failed to update task.");
    const updated = await response.json();
    // Sync local state — MongoDB uses _id
    const index = tasks.findIndex((t) => t._id === id);
    if (index !== -1) tasks[index] = updated;
    renderTasks();
  } catch (err) {
    console.error("Error toggling task:", err);
  }
}

// ─── Network: Delete a Task ───────────────────────────────────────────────────

/**
 * Calls DELETE /tasks/:id then removes it from the local array.
 * @param {string} id - MongoDB _id of the task
 */
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete task.");
    tasks = tasks.filter((t) => t._id !== id);
    renderTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// ─── Render: Task List ────────────────────────────────────────────────────────

/**
 * Filters tasks by currentFilter then rebuilds the DOM list.
 * Also updates sidebar stats.
 */
function renderTasks() {
  const visible = tasks.filter((task) => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "done")    return  task.completed;
    return true; // "all"
  });

  taskList.innerHTML = "";

  if (visible.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    visible.forEach((task) => taskList.appendChild(createTaskElement(task)));
  }

  updateStats();
}

// ─── Render: Single Task Element ─────────────────────────────────────────────

/**
 * Builds a single <li> for a task object and returns it.
 * Uses task._id (MongoDB convention, not task.id).
 * @param {Object} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className        = "task-item" + (task.completed ? " done" : "");
  li.dataset.priority = task.priority;

  // Clickable circle checkbox
  const check = document.createElement("div");
  check.className = "task-check" + (task.completed ? " checked" : "");
  check.title     = task.completed ? "Mark as pending" : "Mark as done";
  check.addEventListener("click", () => toggleTask(task._id));

  // Task title
  const title = document.createElement("span");
  title.className   = "task-title";
  title.textContent = task.title;

  // Priority badge
  const badge = document.createElement("span");
  badge.className   = `priority-badge ${task.priority}`;
  badge.textContent = task.priority;

  // Delete button
  const del = document.createElement("button");
  del.className   = "delete-btn";
  del.title       = "Delete task";
  del.textContent = "✕";
  del.addEventListener("click", () => deleteTask(task._id));

  li.append(check, title, badge, del);
  return li;
}

// ─── UI: Sidebar Stats ────────────────────────────────────────────────────────

/**
 * Recalculates and updates the three stat counters in the sidebar.
 */
function updateStats() {
  if (!statTotal) return; // not present on all pages
  const total   = tasks.length;
  const done    = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  statTotal.textContent   = total;
  statDone.textContent    = done;
  statPending.textContent = pending;
}

// ─── UI: Filter Buttons ───────────────────────────────────────────────────────

/**
 * Wires up click listeners on All / Pending / Done buttons.
 */
function initFilters() {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
}

// ─── UI: Error Messages ───────────────────────────────────────────────────────

/** Shows an inline error below the add-task form. */
function showError(msg) { if (formError) formError.textContent = msg; }

/** Clears the inline error message. */
function clearError()   { if (formError) formError.textContent = ""; }

// ─── Event Listeners ──────────────────────────────────────────────────────────

// Add button click
if (addBtn) addBtn.addEventListener("click", addTask);

// Enter key in the input field
if (taskInput) taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ─── Initialise ───────────────────────────────────────────────────────────────

initFilters();
loadTasks();
