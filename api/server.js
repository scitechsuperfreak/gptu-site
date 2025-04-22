// Import core modules
const express = require('express'); // Handles routing and HTTP server
const { Pool } = require('pg'); // PostgreSQL client with connection pooling
const path = require('path'); // Helps resolve file paths across systems
const fs = require('fs'); // Built-in module to interact with file system

// Initialize Express app
const app = express();

// Set port from environment or fallback to 10000
const PORT = process.env.PORT || 10000;

// Setup PostgreSQL connection pool using environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // should look like postgresql://user:pass@host:port/dbname
  ssl: { rejectUnauthorized: false } // For hosted PostgreSQL (Render, Supabase, etc.)
});

// Show that DB connection string is being picked up (DEBUG ONLY - remove in production)
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Enable JSON parsing middleware so Express can read incoming JSON in POST bodies
app.use(express.json());

// Set view engine to EJS and locate template files in ../views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Root route for sanity check
app.get('/', (req, res) => {
  res.send('GPTU API is live.');
});

// HTML page route: renders server-side EJS into final HTML (visible in browser)
app.get('/testprep_fsa_0001.html', async (req, res) => {
  try {
    // Query top 50 questions from DB
    console.log('Fetching questions...');
    const result = await pool.query('SELECT * FROM questions LIMIT 50');
    console.log('Questions fetched:', result.rows.length);

    // Render EJS template file: testprep_fsa_0001.ejs and inject DB data
    res.render('testprep_fsa_0001', {
      questions: result.rows // pass the data as 'questions' to template
    });

  } catch (err) {
    // If anything fails — show detailed error for debugging
    console.error('Error rendering testprep_fsa_0001:', err);
    res.status(500).send(`
      <h1>Internal Server Error</h1>
      <pre>${err.message}</pre>
    `);
  }
});

// JSON API version of the same data
app.get('/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions LIMIT 10');
    console.log('Sample rows:', result.rows);  // <<< Add this
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
