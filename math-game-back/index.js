const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // ✅ doit être avant app.listen

// Test route
app.get('/', (req, res) => res.send('Hello! Backend is running.'));

// MongoDB connect + start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));
