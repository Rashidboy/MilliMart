import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const slides = [
  {
    title: 'Katta chegirma!',
    subtitle: "Barcha telefonlar 30% gacha arzonroq",
    cta: 'Xarid qilish',
    gradient: 'from-[#E31E24] via-[#ff4757] to-[#ff6b81]',
    emoji: '📱',
    bgPattern: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
  },
  {
    title: 'Yangi mavsum',
    subtitle: "Maishiy texnikada 25% chegirma",
    cta: "Ko'rish",
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    emoji: '🏠',
    bgPattern: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
  },
  {
    title: 'Bepul yetkazish',
    subtitle: "500,000 so'mdan buyurtmalarga",
    cta: 'Batafsil',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    emoji: '🚀',
    bgPattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)',
  },
];

const benefits = [
  { icon: Truck, label: 'Bepul yetkazish', desc: '500K+' },
  { icon: Shield, label: 'Kafolat', desc: '12 oy' },
  { icon: RefreshCw, label: 'Qaytarish', desc: '14 kun' },
  { icon: Headphones, label: "Qo'llab-quvvatlash", desc: '24/7' },
];

const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div>
      {/* Main Banner */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`bg-gradient-to-r ${slide.gradient} relative`}
            style={{ backgroundImage: slide.bgPattern }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="flex items-center justify-between">
                <div className="max-w-lg">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-lg sm:text-xl text-white/80 mb-6"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 bg-white text-[#E31E24] font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {slide.cta}
                  </motion.button>
                </div>
                <div className="hidden lg:block text-[120px] opacity-20 select-none">
                  {slide.emoji}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors hidden sm:flex">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setCurrent(p => (p + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors hidden sm:flex">
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <b.icon size={18} className="text-[#E31E24]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{b.label}</div>
                  <div className="text-xs text-gray-400">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
