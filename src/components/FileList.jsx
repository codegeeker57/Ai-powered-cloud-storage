import React, { useState } from 'react';
import { Download, Trash2, Share2, Eye, Calendar, HardDrive, X } from 'lucide-react';
import './FileList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function FileList({ files, onFileDelete, selectedCategory, searchQuery }) {
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareFileId, setShareFileId] = useState(null);
  const [shareFileName, setShareFileName] = useState('');
  const [sharePermission, setSharePermission] = useState('view');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Images: '🖼️',
      Videos: '🎬',
      Audio: '🎵',
      Documents: '📄',
      Spreadsheets: '📊',
      Presentations: '📑',
      Archives: '📦',
      Code: '💻',
      Other: '📁'
    };
    return icons[category] || '📁';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Images: '#ff6b6b',
      Videos: '#4ecdc4',
      Audio: '#45b7d1',
      Documents: '#96ceb4',
      Spreadsheets: '#ffeaa7',
      Presentations: '#fab1a0',
      Archives: '#a29bfe',
      Code: '#6c5ce7',
      Other: '#74b9ff'
    };
    return colors[category] || '#74b9ff';
  };

  const handleDownload = async (fileId, fileName) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/files/download/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = (fileId, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      onFileDelete(fileId);
    }
  };

  const handleShare = (fileId, fileName) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Open the share modal and set file details
    setShareFileId(fileId);
    setShareFileName(fileName);
    setShareModalOpen(true);
  };
  
  const confirmShare = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/files/${shareFileId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissions: sharePermission })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Close modal
        setShareModalOpen(false);
        
        // Copy to clipboard and show alert
        navigator.clipboard.writeText(data.shareUrl).then(() => {
          alert(`Share link copied to clipboard!\n\nLink: ${data.shareUrl}\nPermissions: ${data.permissions}`);
        }).catch(() => {
          alert(`Share link created!\n\nLink: ${data.shareUrl}\nPermissions: ${data.permissions}`);
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create share link');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to create share link');
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'size' || sortBy === 'created_at') {
      aValue = new Date(aValue).getTime() || parseInt(aValue) || 0;
      bValue = new Date(bValue).getTime() || parseInt(bValue) || 0;
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (files.length === 0) {
    return (
      <div className="file-list-empty">
        <div className="empty-icon">
          <HardDrive size={48} />
        </div>
        <h3>No files found</h3>
        <p>
          {searchQuery
            ? `No files match your search "${searchQuery}"`
            : selectedCategory !== 'All'
            ? `No files in ${selectedCategory} category`
            : 'Upload some files to get started'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Share File</h3>
              <button className="close-button" onClick={() => setShareModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Share "{shareFileName}" with:</p>
              <div className="permission-selector">
                <label>
                  <input 
                    type="radio" 
                    name="permission" 
                    value="view" 
                    checked={sharePermission === 'view'} 
                    onChange={() => setSharePermission('view')} 
                  />
                  View only
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="permission" 
                    value="download" 
                    checked={sharePermission === 'download'} 
                    onChange={() => setSharePermission('download')} 
                  />
                  Download allowed
                </label>
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShareModalOpen(false)}>Cancel</button>
                <button className="share-button" onClick={confirmShare}>Share</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="file-list-header">
        <h2>
          {selectedCategory} Files
          <span className="file-count">({files.length})</span>
        </h2>
        
        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [column, order] = e.target.value.split('-');
              setSortBy(column);
              setSortOrder(order);
            }}
          >
            <option value="created_at-desc">Date (Newest)</option>
            <option value="created_at-asc">Date (Oldest)</option>
            <option value="original_name-asc">Name (A-Z)</option>
            <option value="original_name-desc">Name (Z-A)</option>
            <option value="size-desc">Size (Largest)</option>
            <option value="size-asc">Size (Smallest)</option>
            <option value="category-asc">Category</option>
          </select>
        </div>
      </div>

      <div className="file-list">
        {sortedFiles.map((file) => (
          <div key={file.id} className="file-item">
            <div className="file-icon">
              <span 
                className="category-emoji"
                style={{ color: getCategoryColor(file.category) }}
              >
                {getCategoryIcon(file.category)}
              </span>
            </div>

            <div className="file-details">
              <div className="file-name" title={file.original_name}>
                {file.original_name}
              </div>
              
              <div className="file-meta">
                <span className="file-category">
                  {file.category}
                </span>
                <span className="file-size">
                  {formatFileSize(file.size)}
                </span>
                <span className="file-date">
                  <Calendar size={12} />
                  {formatDate(file.created_at)}
                </span>
              </div>
            </div>

            <div className="file-actions">
              <button
                className="action-button preview"
                onClick={() => handleDownload(file.id, file.original_name)}
                title="Download"
              >
                <Download size={16} />
              </button>
              
              <button
                className="action-button share"
                onClick={() => handleShare(file.id, file.original_name)}
                title="Share"
              >
                <Share2 size={16} />
              </button>
              
              <button
                className="action-button delete"
                onClick={() => handleDelete(file.id, file.original_name)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileList;