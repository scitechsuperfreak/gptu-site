const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// PostgreSQL connection config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Log DB connection string
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Root
app.get('/', (req, res) => {
  res.send('GPTU API is live.');
});

// Questions API
app.get('/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Optional: serve bft.json
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

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, password];
    const result = await pool.query(query, values);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      detail: error.message,
      stack: error.stack
    });
  }
});

// Rendered testprep page
app.get('/testprep_fsa_0001.html', async (req, res) => {
  try {
    const result = await pool.query('SELECT question, answer FROM questions LIMIT 50');
    res.render('testprep_fsa_0001', { qaList: result.rows });
  } catch (error) {
    console.error('Error rendering testprep:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
