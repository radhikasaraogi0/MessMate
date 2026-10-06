import React from 'react';

const MEAL_COLORS = {
  Breakfast: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' }, // Amber
  Lunch: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },     // Sky Blue
  Snacks: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },    // Orange
  Dinner: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },    // Purple
};

const RATING_COLORS = {
  high: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },  // Green (>= 4.0)
  medium: { bg: '#fef9c3', text: '#a16207', border: '#fef08a' },// Yellow (>= 3.0)
  low: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },   // Red (< 3.0)
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
