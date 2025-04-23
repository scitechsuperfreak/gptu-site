// server.js — GPTU Backend API
// This file powers routes like /testprep and /api/questions
// Modified to include CORS headers for frontend fetch support (2025-04)

// ===== IMPORTS & INIT =====
const express = require("express");
const app = express();
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config(); // loads .env file into process.env if present

// OPTIONAL: Use CORS middleware to allow cross-origin fetch requests
const cors = require("cors");
app.use(cors()); // This enables all domains to fetch from your API routes

// ===== POSTGRES CONFIG =====
// Connect to your Postgres database (hosted on Render or elsewhere)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Expects DATABASE_URL in .env
  ssl: {
    rejectUnauthorized: false, // Allow Render's SSL certs
  },
});

// ===== VIEW ENGINE =====
// We use EJS to render HTML templates with server-side data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // Template folder

// ===== STATIC FILES =====
// Optional: serve files like CSS or JS from /api/public/
app.use(express.static(path.join(__dirname, "public")));

// ===== ROUTES =====

// Rendered HTML route (uses EJS template)
app.get("/testprep", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT question_text, answer_text FROM questions LIMIT 50`
    );
    const questions = result.rows;

    console.log("Fetched Questions:", questions.length);

    res.render("testprep_fsa_0001", { questions }); // Injects questions into EJS
  } catch (error) {
    console.error("Error rendering test prep:", error.message);
    res.status(500).send("Server error while loading test prep.");
  }
});

// API route — returns raw JSON, ideal for client-side fetch() or mobile apps
app.get("/api/questions", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT question_text, answer_text FROM questions LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("API Error fetching questions:", err.message);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

// CORS-enabled plain text route for frontend TTS fetch
// Returns Q/A as plain string for use with speakPage()
app.get("/api/testprep.txt", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT question_text, answer_text FROM questions LIMIT 50`
    );
    const rows = result.rows;

    // Convert to plain text format (Q: ... A: ...)
    const output = rows.map((q, i) =>
      `Q${i + 1}: ${q.question_text}\nA${i + 1}: ${q.answer_text}\n`
    ).join("\n");

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(output);
  } catch (err) {
    console.error("Text Export Error:", err.message);
    res.status(500).send("Failed to export test prep text.");
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
