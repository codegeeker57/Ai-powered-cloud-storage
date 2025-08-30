# CloudeJinkya 🤖☁️

CloudeJinkya is a modern, AI-powered personal cloud storage solution that combines intelligent file management with an intuitive user interface. Built with React and Node.js, it offers smart categorization, duplicate detection, file versioning, and granular sharing capabilities.

![CloudeJinkya Demo](https://via.placeholder.com/800x400/2563eb/ffffff?text=CloudeJinkya+Demo)

## ✨ Features

### 🤖 AI-Powered Intelligence
- **Smart Auto-Categorization**: Automatically categorizes files into Images, Videos, Audio, Documents, Archives, and more
- **Duplicate Detection**: Prevents duplicate uploads using MD5 hash comparison
- **Intelligent Search**: Case-insensitive search with real-time results

### 📁 File Management
- **Drag & Drop Upload**: Intuitive file upload with progress tracking
- **File Versioning**: Track and restore previous file versions
- **Bulk Operations**: Upload multiple files simultaneously (up to 2GB each)
- **Smart Organization**: Files automatically organized by category

### 🔐 Security & Sharing
- **JWT Authentication**: Secure login with bcrypt password hashing
- **Granular Sharing**: Share files with view/download permissions
- **Unique Share Links**: Time-limited sharing with custom permissions
- **User Isolation**: Each user's files are completely separate

### 📊 Analytics & Insights
- **Storage Analytics**: Real-time storage usage tracking
- **Category Breakdown**: Visual representation of file distribution
- **Upload Trends**: Track recent activity and usage patterns
- **Smart Limits**: 10GB storage limit with visual indicators

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern CSS**: CSS5 with custom properties, grid, flexbox, and smooth animations
- **Drag & Drop Interface**: Intuitive file management
- **Real-time Updates**: Live progress indicators and status updates

## 🚀 Tech Stack

### Frontend
- **React 18** with JSX (no TypeScript)
- **CSS5** with custom properties, grid, flexbox, and animations
- **Lucide React** for beautiful icons
- **Vite** for lightning-fast development and building

### Backend
- **Node.js** with Express.js
- **SQLite3** for reliable local database
- **JWT** for secure authentication
- **Multer** for file upload handling
- **bcrypt** for password security

## 📁 Project Structure

```
cloudejinkya/
├── backend/
│   ├── server.js              # Express.js server
│   ├── uploads/              # File storage directory
│   ├── uploads/versions/     # Version history storage
│   ├── cloudejinkya.db       # SQLite database
│   ├── .env                  # Environment variables
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── files.js          # File management endpoints
│   │   ├── categories.js     # Category management
│   │   └── stats.js          # Analytics endpoints
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── upload.js         # Multer file upload middleware
│   ├── utils/
│   │   ├── categorize.js     # AI categorization logic
│   │   └── hash.js           # File hashing utilities
│   └── package.json
├── src/
│   ├── App.jsx               # Main React component
│   ├── App.css               # Global styles with CSS5
│   ├── components/
│   │   ├── AuthModal.jsx     # Login/Register modal
│   │   ├── FileUpload.jsx    # Drag & drop file upload
│   │   ├── FileList.jsx      # File management interface
│   │   ├── SearchBar.jsx     # Search and filtering
│   │   ├── Sidebar.jsx       # Category navigation
│   │   └── StatsPanel.jsx    # Storage analytics
│   ├── main.jsx              # React entry point
│   └── index.css             # Base CSS styles
├── public/                   # Static assets
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite configuration
├── .env.local                # Frontend environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 16+ and npm
- **Git** for version control

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/codegeeker57/cloudejinkya.git
cd cloudejinkya
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

4. **Set up environment variables:**

Backend (`.env`):
```env
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

Frontend (`.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start the development servers:**

In one terminal (Backend):
```bash
cd backend
npm run dev
```

In another terminal (Frontend):
```bash
npm run dev
```

6. **Open your browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend (Vercel)

1. **Build the frontend:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard:**
- `VITE_API_URL`: Your backend URL

### Backend (Railway/Heroku)

1. **Prepare for deployment:**
- Ensure `package.json` has correct start script
- Set up environment variables on your platform

2. **Deploy to Railway:**
```bash
railway login
railway link
railway up
```

3. **Or deploy to Heroku:**
```bash
heroku create cloudejinkya-backend
heroku config:set JWT_SECRET=your-secret-key
git subtree push --prefix backend heroku main
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### File Management
- `POST /api/upload` - Upload files (max 2GB each)
- `GET /api/files` - List user files with filtering
- `GET /api/download/:id` - Download file by ID
- `DELETE /api/files/:id` - Delete file
- `POST /api/files/:id/share` - Create share link

### Categories & Analytics
- `GET /api/categories` - Get file categories with counts
- `GET /api/stats` - Get storage statistics
- `GET /api/stats/analytics` - Get detailed analytics

### Sharing
- `GET /api/shared/:token` - Access shared file

## 🧩 Key Features Explained

### AI-Powered Categorization
Files are automatically categorized based on their extensions and MIME types:
- **Images**: .jpg, .png, .gif, .svg, .webp
- **Videos**: .mp4, .avi, .mov, .webm, .mkv
- **Audio**: .mp3, .wav, .flac, .aac, .ogg
- **Documents**: .pdf, .doc, .docx, .txt, .rtf
- **Archives**: .zip, .rar, .7z, .tar, .gz
- **Code**: .js, .html, .css, .py, .java, .cpp

### Smart Duplicate Detection
- Uses MD5 hashing to detect identical files
- Prevents storage waste and maintains data integrity
- Notifies users when duplicates are detected during upload

### File Versioning System
- Automatically tracks file versions
- Stores previous versions in separate directory
- Allows users to restore older versions (future enhancement)

### Granular Sharing
- Generate unique, secure sharing links
- Set view or download permissions
- Optional expiration dates for enhanced security

## 🎨 CSS5 Features

CloudeJinkya uses modern CSS5 features for a beautiful, responsive interface:

- **Custom Properties**: Consistent theming with CSS variables
- **CSS Grid**: Advanced layouts for dashboard and file grids
- **Flexbox**: Flexible component layouts
- **Smooth Animations**: Fade-in effects, progress bars, hover states
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern Selectors**: Advanced pseudo-selectors and attribute selectors

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication with secure tokens
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **File Validation**: Server-side file type and size validation
- **SQL Injection Prevention**: Parameterized queries for database safety
- **CORS Protection**: Configured for specific origins
- **File Isolation**: User-specific file access controls

## 🐛 Testing

### Manual Testing Checklist

1. **Authentication:**
   - [ ] User registration with validation
   - [ ] User login with correct/incorrect credentials
   - [ ] JWT token persistence and expiration

2. **File Operations:**
   - [ ] Single file upload
   - [ ] Multiple file upload
   - [ ] Large file upload (approaching 2GB limit)
   - [ ] File download
   - [ ] File deletion
   - [ ] Duplicate detection

3. **Search & Filtering:**
   - [ ] Search by filename
   - [ ] Category filtering
   - [ ] Real-time search results

4. **Sharing:**
   - [ ] Create share links
   - [ ] Access shared files
   - [ ] Permission restrictions

## 🚀 Future Enhancements

- **Real AI Integration**: Implement actual AI for content analysis
- **File Versioning UI**: Interface for managing file versions
- **Advanced Search**: Semantic search with AI-powered relevance
- **Collaborative Features**: Real-time collaboration on files
- **Mobile App**: React Native mobile application
- **Cloud Storage Integration**: AWS S3, Google Drive integration
- **Advanced Analytics**: Usage insights and storage optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CodeGeeker57**
- GitHub: [@codegeeker57](https://github.com/codegeeker57)
- Project: [CloudeJinkya](https://github.com/codegeeker57/cloudejinkya)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- Lucide React for beautiful icons
- SQLite team for the reliable database
- Vercel and Railway for excellent deployment platforms

---

<div align="center">
  <strong>Built with ❤️ by CodeGeeker57</strong>
</div>