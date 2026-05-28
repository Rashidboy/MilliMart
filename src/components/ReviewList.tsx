import React from 'react';
import { ThumbsUp, ThumbsDown, Calendar, CheckCircle, Clock } from 'lucide-react';
import StarRating from './StarRating';
import EmptyState from './EmptyState';
import { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
  showStatus?: boolean;
  onToggleStatus?: (id: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, showStatus = false, onToggleStatus }) => {
  if (reviews.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E31E24] to-[#ff4757] flex items-center justify-center text-white font-bold text-sm shadow-md">
                {review.userName.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size={14} />
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={10} />
                    {review.date}
                  </span>
                </div>
              </div>
            </div>

            {showStatus && (
              <button
                onClick={() => onToggleStatus?.(review.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  review.status === 'approved'
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
              >
                {review.status === 'approved' ? (
                  <>
                    <CheckCircle size={12} />
                    Tasdiqlangan
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    Kutilmoqda
                  </>
                )}
              </button>
            )}
          </div>

          {/* Pros */}
          {review.pros && (
            <div className="mb-3 bg-green-50/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-1">
                <ThumbsUp size={12} />
                Afzalliklar
              </div>
              <p className="text-sm text-gray-700">{review.pros}</p>
            </div>
          )}

          {/* Cons */}
          {review.cons && (
            <div className="mb-3 bg-red-50/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold mb-1">
                <ThumbsDown size={12} />
                Kamchiliklar
              </div>
              <p className="text-sm text-gray-700">{review.cons}</p>
            </div>
          )}

          {/* Comment */}
          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
