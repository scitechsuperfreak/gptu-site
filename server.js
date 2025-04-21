import express from 'express';
import authRoutes from './server/auth.js';

const app = express();
app.use(express.json()); // Enables parsing of JSON bodies

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

app.use('/', authRoutes); // Mount the auth router

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});