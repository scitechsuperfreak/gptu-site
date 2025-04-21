import express from 'express';
import authRoutes from './server/auth.js';

const app = express();
app.use(express.json());


app.use('/', (req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});


app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});