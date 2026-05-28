import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  interactive = false,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hoverRating || rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={`transition-all duration-200 ${
              interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            }`}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRate?.(starValue)}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                filled
                  ? 'fill-[#FF9F0A] text-[#FF9F0A] drop-shadow-sm'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
