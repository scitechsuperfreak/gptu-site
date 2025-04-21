import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// QA endpoint
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

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  const newUser = { username, password };

  const filePath = path.join(__dirname, 'server', 'users.json');
  let users = [];

  try {
    if (fs.existsSync(filePath)) {
      users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'User registered' });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});