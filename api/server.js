const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.send('GPTU API is live.');
});

app.get('/testprep_fsa_0001.html', async (req, res) => {
  try {
    console.log('Fetching questions...');
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    console.log('Questions fetched:', result.rows.length);
    res.render('testprep_fsa_0001', { questions: result.rows });
  } catch (err) {
    console.error('Error rendering testprep_fsa_0001:', err);
    res.status(500).send(`
      <h1>Internal Server Error</h1>
      <pre>${err.message}</pre>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});