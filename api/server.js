import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// GET /qa
app.get('/qa', (req, res) => {
  try {
    const qaData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../server/bft.json'), 'utf-8')
    );
    res.render('qa', { qaData });
  } catch (err) {
    console.error('Failed to load /qa route:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST /register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const usersFile = path.resolve(__dirname, '../server/users.json');
    let users = [];

    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    }

    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    users.push({ username, password }); // (In production, hash this!)
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});