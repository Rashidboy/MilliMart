import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Star, ShoppingCart, Heart, Share2, ChevronRight, Truck, Shield, RefreshCw,
  Minus, Plus, ThumbsUp, ThumbsDown, Calendar, PenLine,
  MessageSquare, ZoomIn,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';
import StarRating from './StarRating';

const ProductDetail: React.FC = () => {
  const {
    products, reviews, selectedProductId, currentUser,
    addToCart, setShowCartSidebar, setShowLoginModal, setShowReviewModal,
    setCurrentPage, reviewsLoading,
  } = useApp();

  const product = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews'>('reviews');
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const approvedReviews = useMemo(() =>
    reviews.filter(r => r.productId === selectedProductId && r.status === 'approved'),
    [reviews, selectedProductId]
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-400 text-lg">Mahsulot topilmadi</p>
    </div>
  );

  const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);
  const avgRating = product.rating.toFixed(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setShowCartSidebar(true);
  };

  const handleReviewClick = () => {
    if (!currentUser) setShowLoginModal(true);
    else setShowReviewModal(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <button onClick={() => setCurrentPage('home')} className="hover:text-gray-600">Bosh sahifa</button>
        <ChevronRight size={14} />
        <span className="hover:text-gray-600">{categories.find(c => c.id === product.category)?.name}</span>
        <ChevronRight size={14} />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image with Zoom */}
          <div
            className="relative bg-white aspect-square rounded-[28px] overflow-hidden cursor-zoom-in shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)] border border-gray-100"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <img
              src={product.images[selectedImage] ?? product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-100"
              style={isZooming ? { transform: 'scale(1.35)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            />
            {isZooming && (
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <ZoomIn size={12} /> Kattalashtirish
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 bg-[#E31E24] text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === i ? 'border-[#E31E24] shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[28px] border border-gray-100 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)] p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={Math.round(Number(avgRating))} size={18} />
              <span className="text-lg font-bold text-gray-800">{avgRating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} sharh)</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 mb-5">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-[#E31E24]">{fmt(product.price)} so'm</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Quantity & Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 rounded-l-xl transition-colors">
                  <Minus size={16} className="text-gray-500" />
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-100 rounded-r-xl transition-colors">
                  <Plus size={16} className="text-gray-500" />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-200/40 transition-shadow disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {product.stock === 0 ? 'Tugagan' : 'Savatga qo\'shish'}
              </motion.button>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-3">
              <button onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${liked ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'}`}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                Sevimli
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-gray-300 transition-all">
                <Share2 size={16} /> Ulashish
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
              {[
                { Icon: Truck, t: 'Bepul yetkazish', d: '500K+ buyurtma' },
                { Icon: Shield, t: 'Kafolat', d: '12 oy' },
                { Icon: RefreshCw, t: 'Qaytarish', d: '14 kun ichida' },
              ].map(b => (
                <div key={b.t} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <b.Icon size={18} className="text-[#E31E24] mb-1" />
                  <span className="text-[10px] font-semibold text-gray-700">{b.t}</span>
                  <span className="text-[10px] text-gray-400">{b.d}</span>
                </div>
              ))}
            </div>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
              <span className="text-xs text-gray-500">
                {product.stock > 10 ? 'Sotuvda bor' : product.stock > 0 ? `Faqat ${product.stock}ta qoldi` : 'Sotuvda yo\'q'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)] overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(['reviews'] as const).map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all relative ${activeTab === tab ? 'text-[#E31E24]' : 'text-gray-500 hover:text-gray-700'}`}>
              <MessageSquare size={18} />
              {`Sharhlar (${approvedReviews.length})`}
              {activeTab === tab && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31E24]" />}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="text-lg font-bold text-gray-800">Foydalanuvchi sharhlari</h3>
                <button onClick={handleReviewClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-200/40 transition-all">
                  <PenLine size={15} /> Sharh qoldirish
                </button>
              </div>

              {/* Rating Summary */}
              {approvedReviews.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-[#E31E24]">{avgRating}</div>
                      <StarRating rating={Math.round(Number(avgRating))} size={16} />
                      <div className="text-xs text-gray-500 mt-1">{approvedReviews.length} sharh</div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = approvedReviews.filter(r => r.rating === star).length;
                        const pct = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-600 w-3">{star}</span>
                            <Star size={12} className="text-[#FF9F0A] fill-[#FF9F0A]" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF9F0A] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-6">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Review List */}
              {reviewsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : approvedReviews.length > 0 ? (
                <div className="space-y-4">
                  {approvedReviews.map(review => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E31E24] to-[#ff4757] flex items-center justify-center text-white font-bold text-sm">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} size={14} />
                              <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} />{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {review.pros && (
                        <div className="mb-3 bg-green-50/60 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-1"><ThumbsUp size={12} /> Afzalliklar</div>
                          <p className="text-sm text-gray-700">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="mb-3 bg-red-50/60 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold mb-1"><ThumbsDown size={12} /> Kamchiliklar</div>
                          <p className="text-sm text-gray-700">{review.cons}</p>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      {review.imageUrl && (
                        <div className="flex gap-2 mt-3">
                          <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden">
                            <img src={review.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-4">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Hali sharhlar yo&apos;q</h3>
                  <p className="text-gray-400 text-center max-w-sm text-sm">
                    Sizning sharhingiz birinchilardan bo&apos;lsin! Mahsulot haqida fikringizni bildiring.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
