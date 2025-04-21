import express from 'express';
import path from 'path';
import fs from 'fs';


const qaData = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'bft.json'), 'utf-8'));

const __dirname = path.resolve();
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // for CSS/assets

// Load QA JSON dynamically

app.get('/qa', (req, res) => {
  try {
    const qaData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'server', 'bft.json'), 'utf-8')
    );
    res.render('qa', { qaData });
  } catch (err) {
    console.error('Failed to load /qa route:', err);
    res.status(500).send('Internal Server Error');
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));