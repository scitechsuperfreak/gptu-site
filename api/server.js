const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 10000;

// PostgreSQL connection config via environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Set in Render's env vars
  ssl: { rejectUnauthorized: false }
});

// Middleware to parse JSON (optional for GETs)
app.use(express.json());

// Basic root route
app.get('/', (req, res) => {
  res.send('GPTU API is live.');
});

// /questions route: fetch data from questions table
app.get('/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});