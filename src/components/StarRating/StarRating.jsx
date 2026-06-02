import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

export default function StarRating({ rating = 0, onChange, size = 18, readOnly = true }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (val) => {
    if (!readOnly) setHoverRating(val);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  const handleClick = (val) => {
    if (!readOnly && onChange) {
      onChange(val);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div 
      className={`${styles.starContainer} ${readOnly ? styles.readOnly : styles.editable}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          type="button"
          disabled={readOnly}
          className={styles.starButton}
          onClick={() => handleClick(val)}
          onMouseEnter={() => handleMouseEnter(val)}
          aria-label={readOnly ? `${rating} de 5 estrelas` : `Avaliar com ${val} estrelas`}
        >
          <Star
            size={size}
            className={`${styles.starIcon} ${
              val <= activeRating ? styles.filled : styles.empty
            }`}
          />
        </button>
      ))}
    </div>
  );
}
