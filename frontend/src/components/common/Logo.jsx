import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const Logo = ({ size = 'md', isDark = false, showTagline = true }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconSize = isSmall ? 18 : isLarge ? 30 : 22;
  const boxDim = isSmall ? 32 : isLarge ? 54 : 42;
  const fontSize = isSmall ? '1.15rem' : isLarge ? '1.85rem' : '1.38rem';
  const taglineSize = isSmall ? '0.62rem' : isLarge ? '0.78rem' : '0.68rem';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isSmall ? '8px' : '12px' }}>
      {/* Visual Logo Mark */}
      <div
        style={{
          width: `${boxDim}px`,
          height: `${boxDim}px`,
          borderRadius: isSmall ? '8px' : isLarge ? '16px' : '12px',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 10px -1px rgba(234, 88, 12, 0.35)',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <UtensilsCrossed size={iconSize} strokeWidth={2.4} />
      </div>

      {/* Brand Name Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize,
            fontWeight: '800',
            letterSpacing: '-0.025em',
            color: isDark ? '#ffffff' : '#0f172a',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>Mess</span>
          <span style={{ color: '#ea580c' }}>Mate</span>
          <span
            style={{
              width: isSmall ? '4px' : '5px',
              height: isSmall ? '4px' : '5px',
              borderRadius: '50%',
              backgroundColor: '#ea580c',
              marginLeft: '2px',
              marginTop: '4px',
            }}
          />
        </div>

        {showTagline && (
          <span
            style={{
              fontSize: taglineSize,
              fontWeight: '700',
              color: isDark ? '#94a3b8' : '#64748b',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '3px',
            }}
          >
            Hostel Dining Portal
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
