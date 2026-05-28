import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart, navigateToProduct, setShowQuickView, setShowCartSidebar } = useApp();
  const [liked, setLiked] = React.useState(false);

  const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
    setShowCartSidebar(true);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickView(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-300 cursor-pointer flex flex-col"
      onClick={() => navigateToProduct(product.id)}
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#E31E24] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
            -{product.discount}%
          </div>
        )}

        {/* Stock indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            So'nggi {product.stock}ta
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            Tugagan
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg text-gray-600 hover:text-[#E31E24]"
            >
              <Eye size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 group-hover:text-[#E31E24] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            <Star size={13} className="text-[#FF9F0A] fill-[#FF9F0A]" />
            <span className="text-xs font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Prices */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-[#E31E24]">{fmt(product.price)} so'm</span>
          </div>
        </div>

        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-200/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={15} />
          Savatga
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
