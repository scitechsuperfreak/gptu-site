import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets (CSS, images, etc.)
app.use(express.static('public'));
app.use(express.json()); // Enable parsing JSON request bodies

// Route: Render Q&A page
app.get('/qa', (req, res) => {
  try {
    const qaData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'server', 'bft.json'), 'utf-8')
    );
    res.render('qa', { qaData });
  } catch (err) {
    console.error('Failed to load /qa route:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route: Catch-all for testing 404s
app.post('/register', (req, res) => {
  console.log('Incoming /register POST:', req.body);
  res.send({ status: 'ok', message: 'Received POST!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});