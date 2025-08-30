const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const categoryRoutes = require('./routes/categories');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ extended: true, limit: '10gb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);

// Shared files endpoint
app.get('/shared/:token', (req, res) => {
  const token = req.params.token;
  
  try {
    // Decode the token
    const decodedData = Buffer.from(token, 'base64').toString();
    const [fileId, timestamp, permissions] = decodedData.split('-');
    
    // We need to access the files array from the files.js module
    // Since we can't directly access it, we'll create a new endpoint in files.js
    // For now, we'll redirect to a new endpoint that will handle shared files
    res.redirect(`/api/files/shared/${token}`);
  } catch (error) {
    console.error('Error accessing shared file:', error);
    return res.status(400).send('Invalid or expired share link');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});