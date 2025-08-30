const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { categorizeFile } = require('../utils/categorize');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 } // 2GB limit
});

// In-memory file storage (replace with database in production)
let files = [];

// Upload files
router.post('/upload', auth, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploaded = [];
    const duplicates = [];
    
    req.files.forEach(file => {
      // Check for duplicates (by name for simplicity)
      const isDuplicate = files.some(existingFile => 
        existingFile.originalName === file.originalname && 
        existingFile.userId === req.userId
      );
      
      if (isDuplicate) {
        duplicates.push({
          name: file.originalname,
          existingFile: file.originalname
        });
        // Delete the uploaded duplicate file
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else {
        const newFile = {
          id: files.length + 1,
          originalName: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          category: categorizeFile(file.originalname),
          uploadedAt: new Date(),
          userId: req.userId
        };
        
        files.push(newFile);
        uploaded.push({
          name: file.originalname,
          category: newFile.category
        });
      }
    });

    res.json({ uploaded, duplicates });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get user files
router.get('/', auth, (req, res) => {
  try {
    const userFiles = files.filter(file => file.userId === req.userId);
    res.json({ files: userFiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Delete file
router.delete('/:id', auth, (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const fileIndex = files.findIndex(file => file.id === fileId && file.userId === req.userId);
    
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[fileIndex];
    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from array
    files.splice(fileIndex, 1);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Download file
router.get('/download/:id', auth, (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const file = files.find(file => file.id === fileId && file.userId === req.userId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Share file
router.post('/:id/share', auth, (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const { permissions } = req.body;
    
    if (!permissions || !['view', 'download'].includes(permissions)) {
      return res.status(400).json({ error: 'Invalid permissions' });
    }
    
    const file = files.find(file => file.id === fileId && file.userId === req.userId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Generate a simple share token (in a real app, use a more secure method)
    const shareToken = Buffer.from(`${file.id}-${Date.now()}-${permissions}`).toString('base64');
    
    // In a real app, store this in a database
    file.shareToken = shareToken;
    file.sharePermissions = permissions;
    
    const shareUrl = `${req.protocol}://${req.get('host')}/shared/${shareToken}`;
    
    res.json({
      shareUrl,
      permissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

// Access shared file
router.get('/shared/:token', (req, res) => {
  const token = req.params.token;
  
  try {
    // Decode the token
    const decodedData = Buffer.from(token, 'base64').toString();
    const [fileId, timestamp, permissions] = decodedData.split('-');
    
    // Find the file
    const file = files.find(file => file.id === parseInt(fileId) && file.shareToken === token);
    
    if (!file) {
      return res.status(404).send('Shared file not found or link expired');
    }
    
    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found on server');
    }
    
    // Check permissions
    if (permissions === 'download') {
      return res.download(filePath, file.originalName);
    } else {
      // For 'view' permission, just serve the file
      return res.sendFile(filePath);
    }
  } catch (error) {
    console.error('Error accessing shared file:', error);
    return res.status(400).send('Invalid or expired share link');
  }
});

module.exports = router;