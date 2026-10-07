import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 20,
  showLabel = false,
  color = '#fbbf24', // radiant gold
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const activeValue = hoverRating || rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', gap: '2px' }}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = activeValue >= starValue;
          const isHalf = !isFilled && activeValue >= starValue - 0.5;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              style={{
                background: 'none',
                border: 'none',
                padding: '1px',
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease',
                transform: interactive && hoverRating === starValue ? 'scale(1.2)' : 'scale(1)',
              }}
              title={interactive ? `Rate ${starValue} of ${maxRating}` : `${rating} out of ${maxRating}`}
            >
              <Star
                size={size}
                fill={isFilled ? color : isHalf ? 'url(#halfGrad)' : 'none'}
                stroke={isFilled || isHalf ? color : '#3f4452'}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: '700',
            color: '#f8fafc',
            marginLeft: '4px',
          }}
        >
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
