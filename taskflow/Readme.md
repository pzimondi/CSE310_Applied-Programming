# TaskFlow

A full-stack task management web application built with **Node.js**, **Express**, and **MongoDB Atlas**.

## Overview

TaskFlow lets you create, complete, and delete tasks from a clean browser UI. Every task is stored as a document in a MongoDB Atlas cloud database, so your list persists permanently. The app demonstrates a complete REST API workflow — the browser uses the `fetch()` API to talk to the Express server, which reads and writes to MongoDB via Mongoose.

This project was built as Module 2 of **CSE 310 — Applied Programming** at Brigham Young University–Idaho.

## Demo Video

[Watch the walkthrough video here](YOUR_VIDEO_LINK_HERE)

## Development Environment

- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MongoDB Atlas (cloud)
- **ODM:** Mongoose
- **CORS:** cors npm package
- **Config:** dotenv for environment variables
- **Frontend:** HTML5, CSS3 (custom properties)
- **Client JS:** Vanilla ES6+ with fetch() API

## Project Structure

```
taskflow/
├── server.js              ← Express entry point + MongoDB connection
├── package.json           ← Dependencies and npm scripts
├── .env.example           ← Template for your .env file
├── .gitignore             ← Excludes node_modules and .env
├── README.md              ← This file
│
├── models/
│   └── Task.js            ← Mongoose schema defining a Task document
│
├── routes/
│   └── tasks.js           ← REST API: GET / POST / PATCH / DELETE /tasks
│
└── public/
    ├── index.html         ← Main task list page (Page 1)
    ├── about.html         ← About page with live DB stats (Page 2)
    ├── 404.html           ← Custom not-found page (Page 3)
    ├── css/
    │   └── style.css      ← All styles
    └── js/
        └── app.js         ← Client-side fetch() calls and DOM logic
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A free [MongoDB Atlas](https://cloud.mongodb.com) account with a cluster

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# 2. Install dependencies
npm install

# 3. Create your .env file
# Copy .env.example to .env and fill in your MongoDB connection string
# MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
# PORT=3000

# 4. Start the server
npm start
```

Open your browser at **http://localhost:3000**

### Development Mode (auto-restart on save)

```bash
npm run dev
```

## Features

- Add tasks with a title and priority level (Low / Medium / High)
- Mark tasks complete — click the circle to toggle; click again to undo
- Delete tasks permanently with the ✕ button
- Filter the list: All / Pending / Done
- Live stats in the sidebar update instantly
- Tasks persist in MongoDB Atlas across server restarts
- About page fetches and displays live database stats from the server
- Custom 404 page for any unknown URL

## REST API Reference

| Method   | Endpoint     | Description                                    |
| -------- | ------------ | ---------------------------------------------- |
| `GET`    | `/tasks`     | Return all tasks from MongoDB (newest first)   |
| `POST`   | `/tasks`     | Create a new task `{ title, priority }`        |
| `PATCH`  | `/tasks/:id` | Toggle the completed status of a task          |
| `DELETE` | `/tasks/:id` | Permanently delete a task                      |
| `GET`    | `/stats`     | Return live counts (total, completed, pending) |

## Module Requirements Checklist

### Common Requirements

- [x] Software written by the student
- [x] All code documented with useful comments
- [x] README.md filled out completely using the Web Apps template
- [x] 4–5 minute video with talking head, demo, and code walkthrough
- [x] Code published in a public GitHub repository

### Unique Requirements — Web Apps

- [x] At least two HTML pages populated by NodeJS code — `index.html` and `about.html`
- [x] Interactive — content changes based on user input (add / toggle / delete / filter)
- [x] Runs on local test server — Express on port 3000
- [x] Database integrated — MongoDB Atlas via Mongoose ✅ (optional requirement)
- [x] Third dynamically generated page — `404.html` ✅ (optional requirement)

## Useful Links

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [MDN fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [dotenv npm package](https://www.npmjs.com/package/dotenv)

## Author

**Pastor Munashe Zimondi**
CSE 310 — Applied Programming
Brigham Young University–Idaho

```

---

**Important:** After you record your video, find this line in the README:
```

[Watch the walkthrough video here](YOUR_VIDEO_LINK_HERE)

```

```
