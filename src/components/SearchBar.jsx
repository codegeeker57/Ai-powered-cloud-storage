import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <Search className="search-icon" size={18} />
      
      <input
        type="text"
        placeholder="Search files by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-input"
      />
      
      {query && (
        <button className="clear-button" onClick={handleClear}>
          <X size={16} />
        </button>
      )}
      
      {isFocused && (
        <div className="search-suggestions">
          <div className="search-tip">
            💡 <strong>Pro tip:</strong> Use specific keywords for better results
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;