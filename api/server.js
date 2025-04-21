const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const __dirnameResolved = path.resolve();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirnameResolved, 'views'));

// Serve static files from 'public' (if any)
app.use(express.static('public'));

// Route to render QA page with JSON data
app.get('/qa', (req, res) => {
  try {
    const filePath = path.join(__dirnameResolved, '../server/bft.json');
    const qaData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.render('qa', { qaData });
  } catch (err) {
    console.error('Failed to load /qa route:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Catch-all fallback (optional)
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});