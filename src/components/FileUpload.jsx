import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import './FileUpload.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function FileUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    // Validate file sizes (10GB limit)
    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10GB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setUploadResults(null);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('token');
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadResults(response);
          setSelectedFiles([]);
          onUploadSuccess();
        } else {
          const error = JSON.parse(xhr.responseText);
          alert(error.error || 'Upload failed');
        }
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        alert('Upload failed due to network error');
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', `${API_URL}/files/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <div className="upload-icon">
          <Upload size={48} />
        </div>

        <div className="upload-text">
          <h3>Upload Files</h3>
          <p>Drag and drop files here, or click to browse</p>
          <p className="upload-hint">Maximum file size: 2GB</p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h4>Selected Files ({selectedFiles.length})</h4>
          <div className="files-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <button
                  className="remove-file"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="upload-actions">
            <button
              className="upload-button"
              onClick={uploadFiles}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
            </button>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Results */}
      {uploadResults && (
        <div className="upload-results">
          {uploadResults.uploaded.length > 0 && (
            <div className="upload-success">
              <CheckCircle className="result-icon success" size={20} />
              <div>
                <strong>Successfully uploaded {uploadResults.uploaded.length} files</strong>
                <ul>
                  {uploadResults.uploaded.map((file, index) => (
                    <li key={index}>{file.name} ({file.category})</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {uploadResults.duplicates.length > 0 && (
            <div className="upload-warning">
              <AlertCircle className="result-icon warning" size={20} />
              <div>
                <strong>Skipped {uploadResults.duplicates.length} duplicate files</strong>
                <ul>
                  {uploadResults.duplicates.map((duplicate, index) => (
                    <li key={index}>
                      {duplicate.name} (duplicate of {duplicate.existingFile})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;