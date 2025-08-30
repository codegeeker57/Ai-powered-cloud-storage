const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// In-memory storage for demonstration (replace with database in production)
let files = [];

// Get user statistics
router.get('/', auth, (req, res) => {
  try {
    const userFiles = files.filter(file => file.userId === req.userId);
    
    const totalFiles = userFiles.length;
    const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
    
    const categories = userFiles.reduce((acc, file) => {
      const category = file.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const recentFiles = userFiles
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, 5);

    res.json({
      totalFiles,
      totalSize,
      categories,
      recentFiles
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;