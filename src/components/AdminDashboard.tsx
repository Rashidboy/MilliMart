import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, MessageSquare, ShoppingCart, Users, TrendingUp, Star,
  Trash2, CheckCircle, Clock, Search, Plus, Edit3, X, BarChart3,
  Truck, BoxIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminTab } from '../types';
import { categories } from '../data/categories';

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
};

const statusLabels: Record<string, string> = {
  pending: 'Kutilmoqda',
  processing: 'Jarayonda',
  shipped: 'Yo\'lda',
  delivered: 'Yetkazilgan',
  cancelled: 'Bekor qilingan',
};

const AdminDashboard: React.FC = () => {
  const {
    products, addProduct, updateProduct, deleteProduct,
    reviews, deleteReview, toggleReviewStatus,
    orders, updateOrderStatus,
    users, adminTab, setAdminTab,
  } = useApp();

  const [searchQ, setSearchQ] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  /* mobile sidebar handled by tabs */

  // Product form state
  const emptyForm = { name: '', price: 0, discount: 0, category: 'phones', description: '', stock: 0, image: '' };
  const [form, setForm] = useState(emptyForm);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';
    return [
      { label: 'Mahsulotlar', value: products.length, icon: Package, color: 'bg-blue-500', bg: 'bg-blue-50', tc: 'text-blue-600' },
      { label: 'Sharhlar', value: reviews.length, icon: MessageSquare, color: 'bg-amber-500', bg: 'bg-amber-50', tc: 'text-amber-600' },
      { label: 'Buyurtmalar', value: orders.length, icon: ShoppingCart, color: 'bg-emerald-500', bg: 'bg-emerald-50', tc: 'text-emerald-600' },
      { label: 'Daromad', value: fmt(totalRevenue), icon: TrendingUp, color: 'bg-purple-500', bg: 'bg-purple-50', tc: 'text-purple-600' },
      { label: 'Foydalanuvchilar', value: users.filter(u => u.role === 'user').length, icon: Users, color: 'bg-pink-500', bg: 'bg-pink-50', tc: 'text-pink-600' },
      { label: "O'rtacha baho", value: avgRating, icon: Star, color: 'bg-orange-500', bg: 'bg-orange-50', tc: 'text-orange-600' },
    ];
  }, [products, reviews, orders, users]);

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Umumiy', icon: LayoutDashboard },
    { id: 'products', label: 'Mahsulotlar', icon: Package },
    { id: 'reviews', label: 'Sharhlar', icon: MessageSquare },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingCart },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
  ];

  const openEditProduct = (id: string) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setEditingProduct(id);
    setForm({
      name: p.name, price: p.price,
      discount: p.discount, category: p.category, description: p.description,
      stock: p.stock, image: p.images[0] ?? '',
    });
    setShowProductForm(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, price: form.price,
      discount: form.discount, category: form.category, description: form.description,
      images: [form.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80'],
      stock: form.stock, rating: 0, reviewCount: 0,
    };
    if (editingProduct) {
      updateProduct(editingProduct, data);
    } else {
      addProduct(data);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const filteredReviews = reviews.filter(r =>
    r.userName.toLowerCase().includes(searchQ.toLowerCase()) || r.comment.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 sticky top-24">
            <div className="flex items-center gap-3 px-3 py-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E31E24] to-[#ff4757] flex items-center justify-center">
                <LayoutDashboard size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Admin Panel</h2>
                <p className="text-[10px] text-gray-400">Boshqaruv tizimi</p>
              </div>
            </div>
            <nav className="space-y-0.5">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setAdminTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    adminTab === tab.id
                      ? 'bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white shadow-lg shadow-red-200/30'
                      : 'text-gray-600 hover:bg-gray-50'}`}>
                  <tab.icon size={17} /> {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden w-full">
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  adminTab === tab.id ? 'bg-[#E31E24] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map(s => (
              <motion.div key={s.label} whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon size={18} className={s.tc} />
                  </div>
                  <TrendingUp size={14} className="text-green-400" />
                </div>
                <div className="text-2xl font-extrabold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Overview Tab */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              {/* Rating Distribution */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={18} /> Baholar taqsimoti</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-600 w-4">{star}</span>
                        <Star size={12} className="text-[#FF9F0A] fill-[#FF9F0A]" />
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            className="h-full bg-gradient-to-r from-[#E31E24] to-[#ff4757] rounded-full" />
                        </div>
                        <span className="text-xs text-gray-400 w-16 text-right">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">So'nggi buyurtmalar</h3>
                <div className="space-y-2">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs ${statusColors[order.status]?.split(' ')[0] || 'bg-gray-200'}`}>
                        {order.status === 'delivered' ? <CheckCircle size={16} /> : order.status === 'shipped' ? <Truck size={16} /> : <Clock size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{order.userName}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{fmt(order.total)} so'm</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {adminTab === 'products' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="font-bold text-gray-800">Mahsulotlar boshqaruvi</h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Qidirish..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                      className="w-full sm:w-48 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20" />
                  </div>
                  <button onClick={openNewProduct}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-200/30 transition-all shrink-0">
                    <Plus size={15} /> Qo'shish
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">Mahsulot</th>
                      <th className="px-6 py-3 text-left hidden md:table-cell">Narx</th>
                      <th className="px-6 py-3 text-left hidden lg:table-cell">Zaxira</th>
                      <th className="px-6 py-3 text-left hidden sm:table-cell">Kategoriya</th>
                      <th className="px-6 py-3 text-left">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map(p => {
                      const cat = categories.find(c => c.id === p.category);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                                {cat?.icon || '📦'}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-800 line-clamp-1">{p.name}</div>
                                <div className="text-xs text-gray-400">{p.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="text-sm font-bold text-[#E31E24]">{fmt(p.price)}</div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${p.stock > 10 ? 'bg-green-50 text-green-600' : p.stock > 0 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                              {p.stock > 10 ? `${p.stock} dona` : p.stock > 0 ? `${p.stock} qoldi` : 'Tugagan'}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="text-xs text-gray-500">{cat?.name || p.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEditProduct(p.id)}
                                className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-all" title="Tahrirlash">
                                <Edit3 size={15} />
                              </button>
                              <button onClick={() => { if (confirm("O'chirmoqchimisiz?")) deleteProduct(p.id); }}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all" title="O'chirish">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    <BoxIcon size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Mahsulotlar topilmadi</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {adminTab === 'reviews' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Sharhlar moderatsiyasi</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Qidirish..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 w-48" />
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {filteredReviews.map(r => (
                  <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E31E24] to-[#ff4757] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {r.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 text-sm">{r.userName}</span>
                          <div className="flex items-center gap-0.5">
                            <Star size={12} className="text-[#FF9F0A] fill-[#FF9F0A]" />
                            <span className="text-xs font-bold">{r.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">{r.date}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {r.status === 'approved' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.comment}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button onClick={() => toggleReviewStatus(r.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              r.status === 'approved' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                            {r.status === 'approved' ? <><Clock size={12} /> Bekor qilish</> : <><CheckCircle size={12} /> Tasdiqlash</>}
                          </button>
                          <button onClick={() => deleteReview(r.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            <Trash2 size={12} /> O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredReviews.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sharhlar topilmadi</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {adminTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Buyurtmalar</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {orders.map(order => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">#{order.id}</span>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.userName} • {order.userPhone}</p>
                        <p className="text-xs text-gray-400 mt-1">{order.address}</p>
                        <div className="mt-2 space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-xs text-gray-500">
                              {item.productName} × {item.quantity} = {fmt(item.price * item.quantity)} so'm
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-gray-800">{fmt(order.total)} so'm</p>
                        <p className="text-xs text-gray-400 mb-2">{order.date}</p>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as typeof order.status)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20"
                        >
                          <option value="pending">Kutilmoqda</option>
                          <option value="processing">Jarayonda</option>
                          <option value="shipped">Yo'lda</option>
                          <option value="delivered">Yetkazilgan</option>
                          <option value="cancelled">Bekor qilish</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {adminTab === 'users' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Foydalanuvchilar</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {users.map(user => (
                  <div key={user.id} className="flex items-center gap-4 p-6">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                        : 'bg-gradient-to-br from-[#E31E24] to-[#ff4757] text-white'}`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
                      <div className="text-xs text-gray-400">+{user.phone}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-1">{user.createdAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showProductForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowProductForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-[#E31E24] to-[#ff4757] px-8 pt-8 pb-6">
                <button onClick={() => setShowProductForm(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                  <X size={16} className="text-white" />
                </button>
                <h2 className="text-xl font-bold text-white">{editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
              </div>
              <form onSubmit={handleProductSubmit} className="p-8 space-y-4">
                <input type="text" placeholder="Mahsulot nomi" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Narx (so'm)" required value={form.price || ''}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20" />
                  <input type="text" placeholder="Rasm URL" value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Chegirma (%)" value={form.discount || ''}
                    onChange={e => setForm({ ...form, discount: Number(e.target.value) })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20" />
                  <input type="number" placeholder="Zaxira (dona)" required value={form.stock || ''}
                    onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20" />
                </div>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
                <textarea placeholder="Tavsif" required value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 resize-none" />
                <button type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-200/40">
                  {editingProduct ? 'Saqlash' : "Qo'shish"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
