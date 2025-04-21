import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static('public'));

// Load QA JSON dynamically
app.get('/qa', (req, res) => {
  try {
    const qaData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, 'server', 'bft.json'),
        'utf-8'
      )
    );
    res.render('qa', { qaData });
  } catch (err) {
    console.error('Failed to load /qa route:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Default route (optional)
app.get('/', (req, res) => {
  res.send('GPTU API is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});