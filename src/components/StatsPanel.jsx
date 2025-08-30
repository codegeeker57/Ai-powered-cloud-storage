import React from 'react';
import { HardDrive, Files, TrendingUp, Calendar } from 'lucide-react';
import './StatsPanel.css';

function StatsPanel({ stats }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h3>Storage Stats</h3>
      </div>

      {/* Storage Usage */}
      <div className="stat-card">
        <div className="stat-icon">
          <HardDrive size={20} />
        </div>
        <div className="stat-content">
          <h4>Storage Used</h4>
          <div className="storage-info">
            <span className="storage-used">{formatFileSize(stats.totalSize)}</span>
            <span className="storage-limit">of {formatFileSize(stats.storageLimit)}</span>
          </div>
          <div className="storage-bar">
            <div 
              className="storage-fill"
              style={{ 
                width: `${Math.min(stats.storageUsedPercentage, 100)}%`,
                backgroundColor: stats.storageUsedPercentage > 80 ? '#ef4444' : '#2563eb'
              }}
            />
          </div>
        </div>
      </div>

      {/* File Count */}
      <div className="stat-card">
        <div className="stat-icon">
          <Files size={20} />
        </div>
        <div className="stat-content">
          <h4>Total Files</h4>
          <div className="stat-number">{stats.totalFiles}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stat-card">
        <div className="stat-icon">
          <TrendingUp size={20} />
        </div>
        <div className="stat-content">
          <h4>Recent Uploads</h4>
          <div className="stat-number">{stats.recentUploads}</div>
          <div className="stat-subtitle">Last 7 days</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="stat-card category-breakdown">
        <h4>Category Breakdown</h4>
        <div className="category-stats">
          {stats.categoryBreakdown.map((category) => (
            <div key={category.category} className="category-stat">
              <div className="category-stat-header">
                <div 
                  className="category-color"
                  style={{ backgroundColor: getCategoryColor(category.category) }}
                />
                <span className="category-stat-name">{category.category}</span>
                <span className="category-stat-count">{category.fileCount}</span>
              </div>
              <div className="category-stat-size">
                {formatFileSize(category.size)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;