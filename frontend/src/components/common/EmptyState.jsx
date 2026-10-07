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
        backgroundColor: '#181a20',
        borderRadius: '16px',
        border: '1px dashed #262933',
        margin: '16px 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#262315',
          color: '#fef08a',
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
          color: '#f8fafc',
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
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
