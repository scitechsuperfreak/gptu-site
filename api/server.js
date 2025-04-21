const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is set in Render’s environment
  ssl: { rejectUnauthorized: false }
});

// Test route to get all questions
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).send('Database test failed');
  }
});

// Health route
app.get('/', (req, res) => {
  res.send('API is live');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});