import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, ChevronDown, Heart, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';

const Navbar: React.FC = () => {
  const {
    currentUser, logout, currentPage, setCurrentPage,
    setShowLoginModal, setShowCartSidebar, cartCount,
    searchQuery, setSearchQuery, products, navigateToProduct,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.length >= 2
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) setCatalogOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-300 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={11} /> Toshkent</span>
            <span className="flex items-center gap-1"><Phone size={11} /> +998 71 200 00 00</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Yetkazib berish bepul 500,000 so'mdan</span>
            <span>|</span>
            <span>24/7 Qo'llab-quvvatlash</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => { setCurrentPage('home'); setMobileOpen(false); }}>
              <div className="w-9 h-9 bg-gradient-to-br from-[#E31E24] to-[#ff4757] rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50">
                <span className="text-white font-black text-xs">M</span>
              </div>
              <span className="text-xl font-extrabold hidden sm:block">
                <span className="bg-gradient-to-r from-[#E31E24] to-[#ff4757] bg-clip-text text-transparent">Milli</span>
                <span className="text-gray-800">Mart</span>
              </span>
            </div>

            {/* Catalog Button */}
            <div className="relative hidden lg:block" ref={catalogRef}>
              <button
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-200/40 transition-all"
              >
                <Menu size={16} />
                Katalog
                <ChevronDown size={14} className={`transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catalogOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 grid grid-cols-2 gap-2"
                  >
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSearchQuery(''); setCatalogOpen(false); setCurrentPage('home'); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{cat.name}</div>
                          <div className="text-xs text-gray-400">{cat.count} mahsulot</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Mahsulot qidirish..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] transition-all"
              />
              <AnimatePresence>
                {searchFocused && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    {searchResults.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { navigateToProduct(p.id); setSearchQuery(''); setSearchFocused(false); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 line-clamp-1">{p.name}</div>
                          <div className="text-xs text-[#E31E24] font-semibold">{fmt(p.price)} so'm</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Favorites */}
              <button className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-[#E31E24] transition-all hidden sm:flex">
                <Heart size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCartSidebar(true)}
                className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-[#E31E24] transition-all"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#E31E24] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E31E24] to-[#ff4757] flex items-center justify-center text-white font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[100px] truncate">{currentUser.name}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                          <p className="text-xs text-gray-400">+{currentUser.phone}</p>
                        </div>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => { setCurrentPage(currentPage === 'admin' ? 'home' : 'admin'); setUserMenuOpen(false); }}
                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            {currentPage === 'admin' ? 'Bosh sahifa' : 'Boshqaruv paneli'}
                          </button>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Chiqish
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <User size={16} />
                  Kirish
                </button>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="py-4 space-y-3">
                  {/* Mobile search */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" placeholder="Qidirish..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20"
                    />
                  </div>
                  {searchQuery.length >= 2 && searchResults.map(p => (
                    <button key={p.id} onClick={() => { navigateToProduct(p.id); setSearchQuery(''); setMobileOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-gray-50">
                      <span>{categories.find(c => c.id === p.category)?.icon || '📦'}</span>
                      <div className="text-left"><div className="text-sm font-medium">{p.name}</div><div className="text-xs text-[#E31E24]">{fmt(p.price)} so'm</div></div>
                    </button>
                  ))}
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map(c => (
                      <button key={c.id} onClick={() => { setCurrentPage('home'); setMobileOpen(false); }}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50">
                        <span className="text-xl">{c.icon}</span>
                        <span className="text-[10px] text-gray-600 text-center">{c.name}</span>
                      </button>
                    ))}
                  </div>
                  {!currentUser && (
                    <button onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white text-sm font-semibold rounded-xl">
                      <User size={16} /> Kirish
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
