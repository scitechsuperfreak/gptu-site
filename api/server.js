// server.js

const express = require("express");
const app = express();
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config(); // optional if you use .env files

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or hardcode if needed
  ssl: {
    rejectUnauthorized: false,
  },
});

// Tell Express to use EJS for rendering
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // points to /api/views

// Serve static files like CSS/JS if needed
app.use(express.static(path.join(__dirname, "public")));

// Route to render the testprep page
app.get("/testprep", async (req, res) => {
  try {
    // Query all questions (limit optional)
    const result = await pool.query(
      `SELECT question_text, answer_text FROM questions LIMIT 50`
    );
    const questions = result.rows;

    console.log("Fetched Questions:", questions.length);

    // Render EJS and inject data
    res.render("testprep_fsa_0001", { questions });
  } catch (error) {
    console.error("Error rendering test prep:", error.message);
    res.status(500).send("Server error while loading test prep.");
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
