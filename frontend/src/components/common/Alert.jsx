import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null;

  const configs = {
    success: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#166534',
      icon: <CheckCircle2 size={18} color="#16a34a" />,
    },
    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      text: '#991b1b',
      icon: <AlertCircle size={18} color="#dc2626" />,
    },
    warning: {
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#92400e',
      icon: <AlertTriangle size={18} color="#d97706" />,
    },
    info: {
      bg: '#f0f9ff',
      border: '#bae6fd',
      text: '#075985',
      icon: <Info size={18} color="#0284c7" />,
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
