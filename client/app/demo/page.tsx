'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, ChefHat, Sparkles, Flame } from 'lucide-react';

const LOADING_MESSAGES = [
  'Warming up the kitchen...',
  'Preparing your menu...',
  'Plating up the details...',
  'Fetching fresh ingredients...',
  'Almost ready to serve...'
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] text-white select-none">
      {/* Ambient Radial Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cayenne-red-950/30 via-[#0a0a0f]/80 to-[#0a0a0f]" />

      {/* Decorative Floating Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cayenne-red-500/15 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse delay-1000" />

      {/* Main Glassmorphic Loading Card */}
      <div className="relative z-10 max-w-sm w-full mx-4 p-8 sm:p-10 rounded-3xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] text-center flex flex-col items-center">
        
        {/* Brand Tag Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cayenne-red-500/10 border border-cayenne-red-500/30 text-cayenne-red-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner"
        >
          <Flame className="w-3.5 h-3.5 text-cayenne-red-400 animate-pulse" />
          <span>MenuNest</span>
          <Sparkles className="w-3 h-3 text-orange-400" />
        </motion.div>

        {/* Central Animated Loader Ring with Icons */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
          {/* Outer Glowing Spinning Gradient Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cayenne-red-500 border-r-orange-400 border-b-cayenne-red-600/40 shadow-[0_0_25px_rgba(251,99,4,0.35)]"
          />

          {/* Inner Counter-Spinning Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-orange-500/80 border-l-cayenne-red-400/60"
          />

          {/* Center Glowing Icon */}
          <motion.div
            animate={{ scale: [0.95, 1.08, 0.95] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-tr from-cayenne-red-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center shadow-lg"
          >
            <ChefHat className="w-7 h-7 text-cayenne-red-400 drop-shadow-[0_0_10px_rgba(251,99,4,0.6)]" />
          </motion.div>
        </div>

        {/* Dynamic Loading Text */}
        <div className="h-8 flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-slate-200 text-sm sm:text-base font-medium tracking-wide flex items-center gap-2"
            >
              <Utensils className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{LOADING_MESSAGES[messageIndex]}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: 'easeInOut'
            }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-cayenne-red-500 to-orange-400 rounded-full shadow-[0_0_12px_rgba(251,99,4,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}