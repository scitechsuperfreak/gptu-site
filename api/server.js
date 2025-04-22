const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('DATABASE_URL:', process.env.DATABASE_URL);

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Basic test route
app.get('/', (req, res) => {
  res.send('GPTU API is live.');
});

// Questions API endpoint
app.get('/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Optional JSON file reader
app.get('/bft', (req, res) => {
  const bftPath = path.join(__dirname, '../server/bft.json');
  fs.readFile(bftPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bft.json:', err.message);
      return res.status(500).send('Unable to read file');
    }
    res.json(JSON.parse(data));
  });
});

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
    const values = [username, password];
    const result = await pool.query(query, values);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      detail: error.message,
      stack: error.stack
    });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      detail: error.message,
      stack: error.stack
    });
  }
});

// Rendered Q/A page for TTS playback
app.get('/testprep_fsa_0001.html', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, question, answer FROM questions LIMIT 50');
    res.render('testprep_fsa_0001', { questions: result.rows });
  } catch (error) {
    console.error('Error rendering Q/A page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});