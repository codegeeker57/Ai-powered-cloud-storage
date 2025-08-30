import React, { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import StatsPanel from './components/StatsPanel';
import { User, LogOut } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user info and initialize data
  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        await fetchFiles();
        await fetchCategories();
        await fetchStats();
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Fetch files with search and category filters
  const fetchFiles = async (category = selectedCategory, search = searchQuery) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`${API_URL}/files?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform categories object to array of objects with name and count properties
        const categoriesArray = Object.entries(data.categories || {}).map(([name, count]) => ({
          name,
          count
        }));
        
        // Add 'All' category with total count
        const totalCount = categoriesArray.reduce((sum, category) => sum + category.count, 0);
        categoriesArray.unshift({ name: 'All', count: totalCount });
        
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Handle authentication success
  const handleAuthSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setShowAuthModal(false);
    fetchFiles();
    fetchCategories();
    fetchStats();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setFiles([]);
    setCategories([]);
    setStats(null);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchFiles(category, searchQuery);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchFiles(selectedCategory, query);
  };

  // Handle file upload success
  const handleUploadSuccess = () => {
    fetchFiles();
    fetchCategories();
    fetchStats();
  };

  // Handle file deletion
  const handleFileDelete = async (fileId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFiles();
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading CloudeJinkya...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <div className="welcome-screen">
          <div className="welcome-content">
            <div className="logo">
              <h1>CloudeJinkya</h1>
              <p>AI-Powered Personal Cloud Storage</p>
            </div>
            <div className="welcome-features">
              <div className="feature">
                <h3>🤖 Smart Organization</h3>
                <p>AI automatically categorizes your files</p>
              </div>
              <div className="feature">
                <h3>🔍 Intelligent Search</h3>
                <p>Find files instantly with semantic search</p>
              </div>
              <div className="feature">
                <h3>🔄 Version Control</h3>
                <p>Keep track of file versions and history</p>
              </div>
              <div className="feature">
                <h3>🔗 Smart Sharing</h3>
                <p>Share files with granular permissions</p>
              </div>
            </div>
            <button 
              className="cta-button"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </button>
          </div>
        </div>
        
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">CloudeJinkya</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="header-right">
          <div className="user-info">
            <User size={20} />
            <span>{user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        <main className="main-content">
          <div className="content-header">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
          
          <FileList
            files={files}
            onFileDelete={handleFileDelete}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </main>
        
        <aside className="stats-sidebar">
          {stats && <StatsPanel stats={stats} />}
        </aside>
      </div>
    </div>
  );
}

export default App;