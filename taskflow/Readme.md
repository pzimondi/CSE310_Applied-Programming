# TaskFlow — Web App

TaskFlow is a full-stack task management web application that I built to learn how modern web servers work from the ground up. As a software engineer growing my skills, I wanted to understand how a backend server communicates with a frontend browser through a REST API, how HTTP verbs like GET, POST, PATCH, and DELETE map to real database operations, and how to persist data in a cloud database. This project gave me hands-on experience with all of those concepts in a single cohesive application.

TaskFlow allows users to create tasks with a title and priority level, mark them as complete, delete them, and filter the list. All data is stored permanently in MongoDB Atlas so nothing is lost when the server restarts. To start the server on your computer, navigate to the project folder in your terminal and run `npm install` followed by `npm start`. Then open your browser and go to `http://localhost:3000` to see the first page of the app.

My purpose for writing this software was to move beyond terminal-based programs and learn how real web applications are structured. I specifically wanted to understand the relationship between a Node.js server, a REST API, a cloud database, and browser-side JavaScript — and how they all work together to create an interactive experience for the user.

[Software Demo Video](https://youtu.be/UI12x5LA9PY)

# Web Pages

**Page 1 — index.html (Task List Page)**
This is the main page of the application and the first page a user sees when they visit `http://localhost:3000`. The page is dynamically populated by Node.js — when the browser loads, the client-side JavaScript immediately calls the Express REST API at `GET /tasks`, which queries MongoDB Atlas and returns all stored tasks as JSON. The tasks are then rendered into the DOM by JavaScript. The content of this page changes entirely based on user input — adding a task sends a `POST /tasks` request to the server and the new task appears instantly, completing a task sends a `PATCH /tasks/:id` request and the item gets a strikethrough, deleting a task sends a `DELETE /tasks/:id` request and the item is removed. The sidebar stats (Total, Done, Pending) update live after every action. The filter buttons (All, Pending, Done) change which tasks are visible without reloading the page.

**Page 2 — about.html (About Page)**
This page is reached by clicking the About link in the sidebar navigation. It is dynamically populated by Node.js — when the page loads, the client-side JavaScript calls the Express `GET /stats` endpoint, which queries MongoDB Atlas and returns live counts of total tasks, completed tasks, pending tasks, and the most recently created task. These numbers are injected into the page in real time. The rest of the page describes the project, the tech stack, the features, and what I learned while building it. The user navigates back to the task list by clicking the Back to Tasks link.

**Page 3 — 404.html (Not Found Page)**
This page is served dynamically by Express for any URL that does not match a defined route or static file. For example, visiting `http://localhost:3000/anything` will trigger this page. Express catches the unmatched request and responds with this custom 404 page. It includes navigation links back to the main pages so the user is never stranded.

# Development Environment

I developed this application using Visual Studio Code as my code editor on Windows. I used the VS Code integrated terminal to run all Node.js and npm commands. MongoDB Atlas was used as the cloud-hosted database and was configured through the Atlas web dashboard at cloud.mongodb.com. I used a web browser (Chrome) for testing and viewing the application at localhost:3000.

The application is written entirely in JavaScript. On the server side I used Node.js as the runtime environment and Express 4 as the web framework for handling HTTP routing and middleware. I used Mongoose as the Object Document Mapper to define schemas and interact with MongoDB. The dotenv package loads the MongoDB connection string from a .env file into the environment. The cors package allows the browser to make cross-origin fetch requests to the API without errors. On the client side I used vanilla JavaScript with the browser's built-in fetch API for all HTTP calls, and plain HTML5 and CSS3 for the user interface with no frontend framework.

# Useful Websites

- [Express.js Official Documentation](https://expressjs.com/)
- [Mongoose Official Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [MDN Web Docs — fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs — async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
- [Node.js Official Documentation](https://nodejs.org/en/docs/)
- [dotenv npm package](https://www.npmjs.com/package/dotenv)
- [Wikipedia — Dynamic Web Page](https://en.wikipedia.org/wiki/Dynamic_web_page)
- [cors npm package](https://www.npmjs.com/package/cors)

# Future Work

- Add user authentication so each user has their own private task list with login and logout functionality
- Add due dates to tasks with a calendar picker and the ability to sort or filter by deadline
- Add the ability to edit a task title or change its priority after it has been created
- Deploy the application to a cloud hosting service such as Render or Railway so it is accessible from any device without running a local server
- Add email or browser notifications to remind users of tasks that are due soon
- Add drag and drop reordering so users can manually arrange tasks by importance

```

---
```
