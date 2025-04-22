const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// PostgreSQL connection config via environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Middleware to parse JSON
app.use(express.json());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Basic root route
app.get('/', (req, res) => {
  res.send('GPTU API is live.');
});

// /questions route: fetch data from questions table

app.get('/questions', async (req, res) => {
  try {
    console.log('Connecting to database...');
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    console.log('Query successful. Rows:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error); // FULL OBJECT, not just .message
    res.status(500).send('Internal Server Error');
  }
});


// Optional: load bft.json if needed
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

// /register route: insert user into users table

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

console.log('Request body:', req.body);

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, password];
console.log('Registering user with query:', query);
console.log('With values:', values);
    const result = await pool.query(query, values);

    console.log('User registered successfully:', result.rows[0]);
    res.status(201).json({ user: result.rows[0] });


} catch (error) {
  console.error('Error registering user:', error);
  console.error('Error registering user (message only):', error.message); // <- this one
  res.status(500).json({
    error: 'Internal Server Error',
    detail: error.message,
    stack: error.stack
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
