import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading data...', size = 32 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        color: '#94a3b8',
        gap: '12px',
      }}
    >
      <Loader2
        size={size}
        style={{
          animation: 'spin 1s linear infinite',
          color: '#fef08a',
        }}
      />
      <span style={{ fontSize: '0.925rem', fontWeight: '500' }}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
