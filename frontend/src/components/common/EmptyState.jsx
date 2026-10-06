import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = UtensilsCrossed,
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px dashed #cbd5e1',
        margin: '16px 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ffedd5',
          color: '#ea580c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} />
      </div>
      <h4
        style={{
          fontSize: '1.125rem',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '0.9rem',
          color: '#64748b',
          maxWidth: '400px',
          margin: '0 0 20px 0',
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
