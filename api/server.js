import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // for CSS/assets

// Load QA JSON dynamically
app.get('/qa', (req, res) => {
  const qaData = JSON.parse(fs.readFileSync('./server/bft.json', 'utf-8'));
  res.render('qa', { qaData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));