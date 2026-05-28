import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CartSidebar: React.FC = () => {
  const { showCartSidebar, setShowCartSidebar, cartItems, products, removeFromCart, updateCartQty, cartTotal, clearCart } = useApp();

  const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

  const cartProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  return (
    <AnimatePresence>
      {showCartSidebar && (
        <div className="fixed inset-0 z-50">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCartSidebar(false)} />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#E31E24]" />
                <h2 className="text-lg font-bold text-gray-800">Savat</h2>
                <span className="text-sm text-gray-400">({cartProducts.length})</span>
              </div>
              <button onClick={() => setShowCartSidebar(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">Savat bo'sh</p>
                  <button onClick={() => setShowCartSidebar(false)}
                    className="mt-4 text-sm text-[#E31E24] font-medium hover:underline">
                    Xarid qilishni davom eting
                  </button>
                </div>
              ) : (
                cartProducts.map(item => {
                  return (
                    <motion.div key={item.productId} layout
                      className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                        <img src={item.product!.images[0]} alt={item.product!.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.product!.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                            <button onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-50 rounded-l-lg transition-colors">
                              <Minus size={12} className="text-gray-500" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-50 rounded-r-lg transition-colors">
                              <Plus size={12} className="text-gray-500" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-[#E31E24]">
                            {fmt(item.product!.price * item.quantity)} so'm
                          </span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-start">
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cartProducts.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Jami:</span>
                  <span className="text-xl font-extrabold text-gray-900">{fmt(cartTotal)} so'm</span>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-200/40 transition-shadow">
                  Rasmiylashtirish <ArrowRight size={16} />
                </motion.button>
                <button onClick={clearCart}
                  className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition-colors py-1">
                  Savatni tozalash
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
