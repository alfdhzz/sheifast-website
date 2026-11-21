'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, MessageCircle, ShoppingCart } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useCatalog } from '@/context/CatalogContext';
import { BUSINESS_LINKS } from '@/data/mockCatalog';
import { JastipCategory } from '@/types/catalog';

export type CatalogModeTab = 'ALL' | JastipCategory;

interface NavbarProps {
  activeMode: CatalogModeTab;
  onSelectMode: (mode: CatalogModeTab) => void;
}

export default function Navbar({ activeMode, onSelectMode }: NavbarProps) {
  const {
    totalCartItems,
    setIsCartOpen,
    setIsVisualSearchOpen,
  } = useCatalog();

  const tabs: { id: CatalogModeTab; label: string }[] = [
    { id: 'ALL', label: 'Semua Produk' },
    { id: 'MALL_BRAND', label: 'Brand & Mall' },
    { id: 'EVENT_BAZAAR', label: 'Event Bazaar' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F4EB]/95 backdrop-blur-md border-b border-[#E2D6C5]">
      {/* Main Single-Line Navigation Row */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand Lockup */}
          <Link href="/" className="focus:outline-none shrink-0">
            <BrandLogo size="md" showBadge={true} showTagline={true} />
          </Link>

          {/* Center (Desktop): Clean Single-Line Underline Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
            {tabs.map((tab) => {
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectMode(tab.id)}
                  className={`h-full inline-flex items-center text-sm whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'border-[#683B1E] text-[#2A1D15] font-semibold'
                      : 'border-transparent text-[#6F5E53] hover:text-[#2A1D15] font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <a
              href="#cara-order"
              className="h-full inline-flex items-center text-sm whitespace-nowrap border-b-2 border-transparent text-[#6F5E53] hover:text-[#2A1D15] font-medium transition-colors"
            >
              Cara Order
            </a>
            <a
              href="#tentang-owner"
              className="h-full inline-flex items-center text-sm whitespace-nowrap border-b-2 border-transparent text-[#6F5E53] hover:text-[#2A1D15] font-medium transition-colors"
            >
              Tentang Kami
            </a>
          </nav>

          {/* Right: Clean Single-Line Action Controls (Focused on Search, WA & List Jastip) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="min-h-[40px] px-3 rounded-lg bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#E2D6C5] flex items-center gap-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors"
              title="Cari barang pakai foto"
            >
              <Camera className="w-4 h-4 text-[#683B1E] shrink-0" />
              <span className="hidden sm:inline">Cari Foto</span>
            </button>

            <a
              href={BUSINESS_LINKS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] px-3 rounded-lg bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#E2D6C5] hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors"
              title="Chat & Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#683B1E] shrink-0" />
              <span>Order WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="min-h-[40px] px-3.5 rounded-lg bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] flex items-center gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors"
              aria-label="Buka Keranjang"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Keranjang</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#F9F4EB]/20 text-[#F9F4EB] tabular-nums">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Single-Line Underline Mode Tabs */}
        <div className="flex lg:hidden items-center gap-5 overflow-x-auto no-scrollbar border-t border-[#E2D6C5]/70 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectMode(tab.id)}
                className={`min-h-[42px] py-2 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  isActive
                    ? 'border-[#683B1E] text-[#2A1D15] font-semibold'
                    : 'border-transparent text-[#6F5E53] hover:text-[#2A1D15] font-medium'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <a
            href="#cara-order"
            className="min-h-[42px] py-2 text-xs sm:text-sm whitespace-nowrap border-b-2 border-transparent text-[#6F5E53] hover:text-[#2A1D15] font-medium transition-colors shrink-0"
          >
            Cara Order
          </a>
          <a
            href="#tentang-owner"
            className="min-h-[42px] py-2 text-xs sm:text-sm whitespace-nowrap border-b-2 border-transparent text-[#6F5E53] hover:text-[#2A1D15] font-medium transition-colors shrink-0"
          >
            Tentang Kami
          </a>
        </div>
      </div>
    </header>
  );
}
