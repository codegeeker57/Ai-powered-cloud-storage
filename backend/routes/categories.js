const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// In-memory storage for demonstration (replace with database in production)
let files = [];

// Get file categories with counts
router.get('/', auth, (req, res) => {
  try {
    const userFiles = files.filter(file => file.userId === req.userId);
    
    const categories = userFiles.reduce((acc, file) => {
      const category = file.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;