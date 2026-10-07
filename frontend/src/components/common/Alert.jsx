import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null;

  const configs = {
    success: {
      bg: '#14281e',
      border: '#1e4630',
      text: '#bbf7d0',
      icon: <CheckCircle2 size={18} color="#4ade80" />,
    },
    error: {
      bg: '#2d1519',
      border: '#5c1d24',
      text: '#fca5a5',
      icon: <AlertCircle size={18} color="#f87171" />,
    },
    warning: {
      bg: '#2d2413',
      border: '#5a441a',
      text: '#fef08a',
      icon: <AlertTriangle size={18} color="#fbbf24" />,
    },
    info: {
      bg: '#132338',
      border: '#1e3a5f',
      text: '#93c5fd',
      icon: <Info size={18} color="#38bdf8" />,
    },
  };

  const current = configs[type] || configs.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: '10px',
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        color: current.text,
        fontSize: '0.9rem',
        marginBottom: '16px',
      }}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {current.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: current.text,
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.7,
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
