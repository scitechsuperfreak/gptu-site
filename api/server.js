const express = require('express');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
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
    console.log('Connecting to database...');
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    console.log('Query successful. Rows:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


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
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});