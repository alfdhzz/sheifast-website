'use client';

import React, { useEffect, useState } from 'react';

export default function SplashLoader() {
  const [phase, setPhase] = useState<'entering' | 'exiting' | 'done'>('entering');

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 1450);

    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 1950);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#F9F4EB] flex flex-col items-center justify-center px-6 select-none transition-all duration-500 ease-out ${
        phase === 'exiting'
          ? 'opacity-0 pointer-events-none scale-[1.01]'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Memuat SHEIFAST"
    >
      <div className="flex flex-col items-center text-center">
        {/* 100% Transparent Winged-Box Logo Mark (No square background box, no duplicate embedded text) */}
        <div className="mb-5 animate-splash-logo">
          <img
            src="/images/logo-sheifast-icon.png"
            alt="SHEIFAST Winged Box Logo"
            className="w-24 sm:w-28 h-auto object-contain"
          />
        </div>

        {/* Modern Clean Typography Name Reveal */}
        <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2A1D15] tracking-[0.28em] pl-[0.28em] animate-splash-title">
          SHEIFAST
        </h1>

        <p className="mt-2 text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#6F5E53] animate-splash-subtitle">
          Jasa Titip Anything&apos;s
        </p>

        {/* Minimalist Modern Progress Bar */}
        <div className="mt-7 w-32 sm:w-36 h-[2px] bg-[#E2D6C5] rounded-full overflow-hidden">
          <div className="h-full bg-[#683B1E] rounded-full animate-splash-progress" />
        </div>
      </div>
    </div>
  );
}
