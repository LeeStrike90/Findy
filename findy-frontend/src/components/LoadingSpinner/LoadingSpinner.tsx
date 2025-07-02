import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">뉴스를 불러오는 중...</p>
    </div>
  );
};

export default LoadingSpinner; 