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
        color: '#64748b',
        gap: '12px',
      }}
    >
      <Loader2
        size={size}
        style={{
          animation: 'spin 1s linear infinite',
          color: '#ea580c',
        }}
      />
      <span style={{ fontSize: '0.925rem', fontWeight: '500' }}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
