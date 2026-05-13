import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRate, readonly = false, size = 24 }) => {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="star-btn"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onRate && onRate(star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          <Star
            size={size}
            fill={star <= (hovered || rating) ? '#f59e0b' : 'transparent'}
            color={star <= (hovered || rating) ? '#f59e0b' : '#6b7280'}
            style={{ transition: 'all 0.15s' }}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
