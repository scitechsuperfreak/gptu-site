import express from 'express';
import session from 'express-session';
import authRoutes from './auth.js';

const app = express();
app.use(express.json());

app.use(session({
  secret: 'gptu_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Health check
app.get('/', (req, res) => {
  res.send('API is live');
});

app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});