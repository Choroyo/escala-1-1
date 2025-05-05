import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  );
};

export default Container; 