'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Utensils, Home, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] text-white select-none">
      {/* Background Image Container with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/empty_burger_404.png"
          alt="Empty Burger Background"
          fill
          priority
          className="object-cover object-center opacity-95 scale-105 transition-transform duration-1000 filter brightness-90 contrast-110"
        />
        {/* Gradients for seamless integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-[#0a0a0f]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0a0f]/70 to-[#0a0a0f]" />
      </div>

      {/* Decorative Floating Glowing Orbs */}
      <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-cayenne-red-500/20 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-orange-500/15 rounded-full filter blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Main Content Card */}
      <div className="relative z-10 max-w-2xl w-full mx-4 p-8 sm:p-12 rounded-3xl backdrop-blur-xl bg-white/[0.04] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center flex flex-col items-center">
        
        {/* Top Tag Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cayenne-red-500/10 border border-cayenne-red-500/30 text-cayenne-red-400 text-xs sm:text-sm font-medium mb-6 shadow-inner"
        >
          <Utensils className="w-4 h-4 text-cayenne-red-400 animate-bounce" />
          <span>Error 404: Page Devoured</span>
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
        </motion.div>

        {/* Huge 404 Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mb-2"
        >
          <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-2xl">
            4<span className="text-cayenne-red-500 inline-block hover:scale-110 transition-transform duration-300">0</span>4
          </h1>
        </motion.div>

        {/* Heading & Subtext */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-3"
        >
          Looks like someone ate this page!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-300 text-sm sm:text-base max-w-md mb-8 leading-relaxed"
        >
          The dish you are looking for has been ordered, devoured, and wiped clean from our menu. Let&apos;s get you back to something delicious.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cayenne-red-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-cayenne-red-500/25 hover:shadow-cayenne-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Button
          variant='primary'
            onClick={() => window.history.back()}
            className="w-full h-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}