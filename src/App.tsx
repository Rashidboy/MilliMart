import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import ReviewModal from './components/ReviewModal';
import CartSidebar from './components/CartSidebar';
import { categories } from './data/categories';

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

/* ─── Quick View Modal ─── */
const QuickView: React.FC = () => {
  const { showQuickView, setShowQuickView, products, addToCart, navigateToProduct, setShowCartSidebar } = useApp();
  const product = useMemo(() => products.find(p => p.id === showQuickView), [products, showQuickView]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowQuickView(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <button onClick={() => setShowQuickView(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md">
              <X size={16} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-slate-100 aspect-square flex items-center justify-center">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={14} className={i <= Math.round(product.rating) ? 'text-[#FF9F0A] fill-[#FF9F0A]' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-extrabold text-[#E31E24]">{fmt(product.price)} so'm</div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-6">{product.description}</p>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => { addToCart(product.id); setShowCartSidebar(true); setShowQuickView(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-red-200/40 transition-all">
                    <ShoppingCart size={16} /> Savatga
                  </button>
                  <button onClick={() => { setShowQuickView(null); navigateToProduct(product.id); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                    <Eye size={14} /> Batafsil
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ─── Homepage ─── */
const HomePage: React.FC = () => {
  const { products, searchQuery, productsLoading } = useApp();
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  const displayed = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setDisplayCount(p => Math.min(p + 8, filtered.length));
    }, { rootMargin: '200px' });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div>
      {!searchQuery && <HeroBanner />}

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Kategoriyalar</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${!selectedCategory ? 'bg-[#E31E24] text-white shadow-lg shadow-red-200/30' : 'bg-white border border-gray-100 text-gray-600 hover:border-[#E31E24]/20 hover:shadow-md'}`}
          >
            <span className="text-2xl">🏪</span>
            <span className="text-[10px] sm:text-xs font-semibold">Hammasi</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-br ${cat.gradient} text-white shadow-lg`
                  : 'bg-white border border-gray-100 text-gray-600 hover:border-gray-200 hover:shadow-md'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] sm:text-xs font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Mahsulotlar' : 'Mashhur mahsulotlar'}
          </h2>
          <span className="text-sm text-gray-400">{filtered.length} ta mahsulot</span>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, idx) => (
              <div key={idx} className="rounded-[28px] bg-white p-4 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)]">
                <div className="h-40 rounded-3xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse mb-3" />
                <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse mb-2" />
                <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayed.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Mahsulot topilmadi</h3>
            <p className="text-gray-400 text-sm">Qidiruv so'zini yoki kategoriyani o'zgartirib ko'ring</p>
          </div>
        )}

        {/* Load more trigger */}
        {hasMore && <div ref={loaderRef} className="h-8 mt-8" />}

        {hasMore && (
          <div className="text-center mt-8">
            <button onClick={() => setDisplayCount(p => p + 8)}
              className="px-8 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all">
              Yana ko'rsatish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Footer ─── */
const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400 mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-[#E31E24] to-[#ff4757] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xs">M</span>
            </div>
            <span className="text-xl font-extrabold">
              <span className="text-[#E31E24]">Milli</span>
              <span className="text-white">Mart</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">O'zbekistonning eng katta internet-do'koni. Sifatli mahsulotlar, arzon narxlar va tez yetkazib berish.</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4">Kompaniya</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Biz haqimizda</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Aloqa</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Vakansiyalar</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4">Yordam</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Yetkazib berish</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Qaytarish</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Ko'p so'raladigan savollar</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Maxfiylik siyosati</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4">Aloqa</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={14} /> +998 71 200 00 00</li>
            <li className="flex items-center gap-2"><Mail size={14} /> info@millimart.uz</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Toshkent, O'zbekiston</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
        © 2026 MilliMart. Barcha huquqlar himoyalangan.
      </div>
    </div>
  </footer>
);

/* ─── App Root ─── */
const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <HomePage />
            </motion.div>
          )}
          {currentPage === 'product' && (
            <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ProductDetail />
            </motion.div>
          )}
          {currentPage === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {currentPage !== 'admin' && <Footer />}
      <LoginModal />
      <ReviewModal />
      <CartSidebar />
      <QuickView />
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
