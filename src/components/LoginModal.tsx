import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Lock, User, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, login, register } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length <= 3) return `+${d}`;
    if (d.length <= 5) return `+${d.slice(0, 3)} ${d.slice(3)}`;
    if (d.length <= 8) return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
    if (d.length <= 10) return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
    return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 12) { setError("Telefon raqamni to'liq kiriting"); return; }
    if (password.length < 3) { setError("Parol noto'g'ri"); return; }

    if (isRegister) {
      if (!name.trim()) { setError("Ismingizni kiriting"); return; }
      const res = register(clean, password, name.trim());
      if (!res.success) { setError(res.message); return; }
    } else {
      const res = login(clean, password);
      if (!res.success) { setError("Telefon raqam yoki parol noto'g'ri!"); return; }
    }
    resetForm();
  };

  const resetForm = () => {
    setPhone(''); setPassword(''); setName(''); setError(''); setShowPw(false); setIsRegister(false);
  };

  const handleClose = () => { setShowLoginModal(false); resetForm(); };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E31E24] to-[#ff4757] px-8 pt-8 pb-6 relative">
              <button onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <X size={16} className="text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {isRegister ? "Ro'yxatdan o'tish" : 'Tizimga kirish'}
              </h2>
              <p className="text-white/70 text-sm mt-1">
                {isRegister ? 'Yangi hisob yarating' : 'Davom etish uchun kiring'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm">
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}

              {isRegister && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] transition-all" />
                </div>
              )}

              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder="+998 90 123 45 67" value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))} maxLength={17}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] transition-all" />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#E31E24] to-[#ff4757] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-200/40 transition-shadow">
                {isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
              </motion.button>

              <div className="text-center">
                <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  className="text-[#E31E24] text-sm font-medium hover:underline inline-flex items-center gap-1">
                  <UserPlus size={14} />
                  {isRegister ? 'Hisobingiz bormi? Kirish' : "Hisob yo'q? Ro'yxatdan o'tish"}
                </button>
              </div>

              {!isRegister && (
                <div className="bg-blue-50 rounded-2xl px-4 py-3 text-xs text-blue-600 space-y-0.5">
                  <p className="font-semibold">Admin kirish:</p>
                  <p>Telefon: +998 90 123 45 67</p>
                  <p>Parol: admin</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
