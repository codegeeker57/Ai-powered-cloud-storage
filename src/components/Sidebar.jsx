import React from 'react';
import { Files, Image, Video, Music, FileText, Archive, Code, Folder } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ categories, selectedCategory, onCategorySelect }) {
  const getCategoryIcon = (category) => {
    const icons = {
      All: Files,
      Images: Image,
      Videos: Video,
      Audio: Music,
      Documents: FileText,
      Spreadsheets: FileText,
      Presentations: FileText,
      Archives: Archive,
      Code: Code,
      Other: Folder
    };
    return icons[category] || Folder;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Categories</h3>
      </div>
      
      <div className="category-list">
        {Array.isArray(categories) ? categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          return (
            <button
              key={category.name}
              className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => onCategorySelect(category.name)}
            >
              <div className="category-icon">
                <Icon size={20} />
              </div>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </div>
            </button>
          );
        }) : <div className="category-loading">Loading categories...</div>}
      </div>
    </div>
  );
}

export default Sidebar;