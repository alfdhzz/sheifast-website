'use client';

import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showTagline?: boolean;
}

export default function BrandLogo({
  size = 'md',
  showBadge = true,
  showTagline = true,
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    sm: 'w-8 h-6',
    md: 'w-10 h-7 sm:w-11 sm:h-8',
    lg: 'w-14 h-10',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.12em]',
    md: 'text-lg sm:text-xl tracking-[0.14em]',
    lg: 'text-2xl tracking-[0.14em]',
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none whitespace-nowrap">
      {/* 100% Transparent Winged-Box Icon Mark */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0`}
      >
        {!imgError ? (
          <img
            src="/images/logo-sheifast-icon.png"
            alt="SHEIFAST"
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-bold text-xs text-[#683B1E]">SF</span>
        )}
      </div>

      {/* Clean Modern Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-sans font-extrabold text-[#2A1D15] leading-none ${titleSizes[size]}`}
          >
            SHEIFAST
          </span>
          {showBadge && (
            <span className="hidden xl:inline-block text-[11px] font-medium text-[#6F5E53] border-l border-[#D6C9B8] pl-2 leading-none">
              Part of <strong className="text-[#683B1E] font-semibold">@sheinaz.co</strong>
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-[0.04em] text-[#6F5E53] font-medium mt-0.5">
            Jasa Titip Anything&apos;s
          </span>
        )}
      </div>
    </div>
  );
}
