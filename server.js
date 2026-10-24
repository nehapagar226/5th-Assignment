
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to read HTML form data
app.use(express.urlencoded({ extended: false }));

// GET route: display the registration form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST route: validate student registration
app.post("/register", (req, res) => {
  const { name, email, age, course } = req.body;
  const errors = [];

  // 1. Validate name
  if (typeof name !== "string" || name.trim().length < 3) {
    errors.push("Name must contain at least 3 characters.");
  }

  // 2. Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    typeof email !== "string" ||
    !emailPattern.test(email.trim())
  ) {
    errors.push("Please enter a valid email address.");
  }

  // 3. Validate age
  const parsedAge = Number(age);

  if (
    typeof age !== "string" ||
    age.trim() === "" ||
    !Number.isInteger(parsedAge) ||
    parsedAge < 18 ||
    parsedAge > 100
  ) {
    errors.push("Age must be a whole number between 18 and 100.");
  }

  // 4. Validate course using an allowlist
  const allowedCourses = ["BCA", "BSc IT", "BTech", "MCA"];

  if (
    typeof course !== "string" ||
    !allowedCourses.includes(course)
  ) {
    errors.push("Please select a valid course.");
  }

  // If validation fails, send errors
  if (errors.length > 0) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Registration Errors</title>
      </head>
      <body style="font-family:Arial;padding:30px">
        <h1>Registration Failed</h1>
        <p>Please correct the following errors:</p>
        <ul>
          ${errors.map(error => `<li>${error}</li>`).join("")}
        </ul>
        <a href="/">Return to registration form</a>
      </body>
      </html>
    `);
  }

  // If all validation rules pass
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Registration Success</title>
    </head>
    <body style="font-family:Arial;padding:30px">
      <h1>Registration Successful!</h1>
      <p>Welcome, ${escapeHtml(name.trim())}!</p>
      <p>Your student registration passed server-side validation.</p>
      <p>Selected course: ${escapeHtml(course)}</p>
      <a href="/">Register another student</a>
    </body>
    </html>
  `);
});

// Escape user-provided text before placing it in HTML
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Handle unknown routes
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start ExpressJS server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
