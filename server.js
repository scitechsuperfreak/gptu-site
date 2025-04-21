const express = require('express');
const authRoutes = require('./server/auth');

const app = express();
app.use(express.json());

// Mount the router from auth.js
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});