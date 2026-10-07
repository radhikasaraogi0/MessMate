import React from 'react';

const MEAL_COLORS = {
  Breakfast: { bg: '#fef08a', text: '#0f1013', border: 'transparent' }, // Honey Yellow Pastel
  Lunch: { bg: '#c4b5fd', text: '#0f1013', border: 'transparent' },     // Soft Lilac / Lavender Pastel
  Snacks: { bg: '#fed7aa', text: '#0f1013', border: 'transparent' },    // Warm Peach Pastel
  Dinner: { bg: '#bbf7d0', text: '#0f1013', border: 'transparent' },    // Mint Lime Pastel
};

const RATING_COLORS = {
  high: { bg: '#143823', text: '#86efac', border: '#1f5735' },   // Subtle dark green
  medium: { bg: '#362a12', text: '#fde047', border: '#54421b' }, // Subtle dark amber
  low: { bg: '#381619', text: '#fca5a5', border: '#572227' },    // Subtle dark red
};

export const Badge = ({
  children,
  variant = 'default',
  mealType,
  rating,
  size = 'md',
  className = '',
}) => {
  let style = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderColor: '#e2e8f0',
  };

  if (mealType && MEAL_COLORS[mealType]) {
    style = MEAL_COLORS[mealType];
  } else if (rating !== undefined && rating !== null) {
    const num = Number(rating);
    if (num >= 4.0) style = RATING_COLORS.high;
    else if (num >= 3.0) style = RATING_COLORS.medium;
    else style = RATING_COLORS.low;
  } else if (variant === 'danger') {
    style = { backgroundColor: '#fee2e2', color: '#b91c1c', border: '#fecaca' };
  } else if (variant === 'warning') {
    style = { backgroundColor: '#fef3c7', color: '#b45309', border: '#fde68a' };
  } else if (variant === 'success') {
    style = { backgroundColor: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
  } else if (variant === 'primary') {
    style = { backgroundColor: '#ea580c18', color: '#ea580c', border: '#fed7aa' };
  }

  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? '0.75rem' : '0.85rem';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: '600',
        borderRadius: '9999px',
        border: `1px solid ${style.border || '#e2e8f0'}`,
        backgroundColor: style.bg,
        color: style.text,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
