import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';

const router = express.Router();
const USERS_FILE = './users.json';

let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).send('User exists');
  }
  const hash = await bcrypt.hash(password, 10);
  users[username] = { password: hash };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.status(200).send('Registered');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) return res.status(400).send('Invalid');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).send('Wrong credentials');

  req.session.user = username;
  res.status(200).send('Logged in');
});

router.get('/protected', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  res.send(`Welcome to protected content, ${req.session.user}`);
});

export default router;
