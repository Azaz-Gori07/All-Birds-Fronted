// ✅ components/Loading.jsx
import React from 'react';
import './Loading.css';

const Loading = ({ show }) => {
  return (
    <div className={`loading-overlay ${show ? 'fade-in' : 'fade-out'}`}>
      <div className="premium-spinner"></div>
      <p className="loading-text">Please wait...</p>
    </div>
  );
};

export default Loading;
