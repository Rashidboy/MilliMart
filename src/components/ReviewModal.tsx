import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, FileText, ImageIcon, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ReviewModal: React.FC = () => {
  const { showReviewModal, setShowReviewModal, currentUser, addReview, selectedProductId } = useApp();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  if (!showReviewModal || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (rating === 0) { setError('Iltimos, baho bering'); return; }
    if (!comment.trim()) { setError("Iltimos, sharh matnini kiriting"); return; }

    addReview({
      productId: selectedProductId || '',
      userName: currentUser.name,
      rating,
      pros: pros.trim(),
      cons: cons.trim(),
      comment: comment.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });

    setRating(0); setPros(''); setCons(''); setComment(''); setImageUrl(''); setError('');
  };

  const handleClose = () => {
    setShowReviewModal(false);
    setRating(0); setPros(''); setCons(''); setComment(''); setImageUrl(''); setError('');
  };

  return (
    <AnimatePresence>
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E31E24] to-[#ff4757] px-8 pt-8 pb-6">
              <button onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <X size={16} className="text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">Yangi sharh</h2>
              <p className="text-white/70 text-sm mt-1">Mahsulot haqida fikringizni bildiring</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                  ⚠️ {error}
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Baho bering</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.button key={i} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(i)}
                        className="p-0.5">
                        <Star size={32}
                          className={`transition-colors ${(hoverRating || rating) >= i ? 'text-[#FF9F0A] fill-[#FF9F0A]' : 'text-gray-200 fill-gray-200'}`} />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && <span className="text-2xl font-bold text-[#E31E24]">{rating}/5</span>}
                </div>
              </div>

              {/* Pros */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ThumbsUp size={14} className="text-green-500" /> Afzalliklar
                </label>
                <textarea value={pros} onChange={e => setPros(e.target.value)}
                  placeholder="Mahsulotning afzalliklarini yozing..." rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] resize-none transition-all" />
              </div>

              {/* Cons */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ThumbsDown size={14} className="text-red-500" /> Kamchiliklar
                </label>
                <textarea value={cons} onChange={e => setCons(e.target.value)}
                  placeholder="Mahsulotning kamchiliklarini yozing..." rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] resize-none transition-all" />
              </div>

              {/* Comment */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={14} className="text-blue-500" /> Tavsifi <span className="text-red-400">*</span>
                </label>
                <textarea value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Mahsulot haqida batafsil fikringizni yozing..." rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] resize-none transition-all" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ImageIcon size={14} className="text-purple-500" /> Rasm qo'shish
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/review-image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] transition-all"
                />
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-200/40 transition-shadow">
                Sharhni yuborish
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
