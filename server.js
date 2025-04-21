import express from 'express';
import authRoutes from './server/auth.js';

const app = express();
app.use(express.json()); // Middleware to parse JSON

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

app.use('/', authRoutes); // Mount auth routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});