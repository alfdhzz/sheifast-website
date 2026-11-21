'use client';

import React from 'react';
import { Camera, RotateCcw, Search, X } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import { ProductCategory } from '@/types/catalog';

export type DiscountTierFilter = 'ALL' | '50_PLUS' | '30_PLUS' | 'NORMAL';

interface HeroAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBrandId: string;
  onSelectBrand: (brandId: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDiscountTier: DiscountTierFilter;
  onSelectDiscountTier: (tier: DiscountTierFilter) => void;
  onResetAllFilters: () => void;
  totalFilteredCount: number;
}

const CATEGORIES: Array<{ id: 'All' | ProductCategory; label: string }> = [
  { id: 'All', label: 'Semua' },
  { id: 'Sneakers & Shoes', label: 'Sepatu' },
  { id: 'Tops', label: 'Atasan' },
  { id: 'Dresses', label: 'Dress' },
  { id: 'Bags', label: 'Tas' },
  { id: 'Bottoms', label: 'Bawahan' },
  { id: 'Outerwear', label: 'Outerwear' },
  { id: 'Accessories', label: 'Aksesoris' },
];

const DISCOUNT_TIERS: Array<{ id: DiscountTierFilter; label: string }> = [
  { id: 'ALL', label: 'Semua' },
  { id: '50_PLUS', label: 'Diskon 50%+' },
  { id: '30_PLUS', label: 'Diskon 30%+' },
  { id: 'NORMAL', label: 'Harga Normal' },
];

export default function HeroAndFilters({
  searchQuery,
  onSearchChange,
  selectedBrandId,
  onSelectBrand,
  selectedCategory,
  onSelectCategory,
  selectedDiscountTier,
  onSelectDiscountTier,
  onResetAllFilters,
  totalFilteredCount,
}: HeroAndFiltersProps) {
  const {
    brands,
    setIsVisualSearchOpen,
    visualSearchFilter,
    clearVisualSearchFilter,
  } = useCatalog();

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedBrandId !== 'ALL' ||
    selectedCategory !== 'All' ||
    selectedDiscountTier !== 'ALL' ||
    Boolean(visualSearchFilter?.active);

  return (
    <section className="bg-[#F9F4EB] border-b border-[#E2D6C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8">
        {/* Airy Editorial Header + Integrated Search Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E2D6C5]">
          <div className="space-y-2.5 max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#683B1E]">
              Personal Shopper • Bekasi &amp; Jakarta
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#2A1D15] tracking-tight leading-tight">
              Belanja. Titip. Kami Urus.
            </h1>
            <p className="text-xs sm:text-sm text-[#6F5E53] leading-relaxed">
              Katalog kurasi produk diskon 100% original dari store resmi mall &amp; event bazaar.
            </p>
          </div>

          {/* Minimalist Search & Visual Search Input */}
          <div className="w-full lg:w-[440px] flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6F5E53] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari produk atau brand..."
                className="w-full min-h-[44px] pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#D8CCBC] text-base sm:text-sm text-[#2A1D15] placeholder:text-[#6F5E53]/70 focus:outline-none focus:border-[#683B1E] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded hover:bg-[#EFE6D8] flex items-center justify-center text-[#6F5E53]"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="min-h-[44px] px-4 rounded-xl bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#D8CCBC] font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 whitespace-nowrap"
              title="Cari produk yang mirip dengan foto Anda"
            >
              <Camera className="w-4 h-4 text-[#683B1E]" />
              <span>Cari Foto</span>
            </button>
          </div>
        </div>

        {/* Active Visual Search Banner */}
        {visualSearchFilter?.active && (
          <div className="mt-6 p-4 rounded-xl bg-white border border-[#683B1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={visualSearchFilter.previewUrl}
                alt="Referensi"
                className="w-12 h-12 rounded-lg object-cover border border-[#E2D6C5] shrink-0"
              />
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-semibold text-[#2A1D15]">
                  Pencarian Foto Aktif
                </p>
                <p className="text-xs text-[#6F5E53]">
                  Diurutkan berdasarkan kemiripan visual dengan foto Anda.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearVisualSearchFilter}
              className="min-h-[40px] px-4 rounded-lg bg-[#EFE6D8] hover:bg-[#E2D6C5] text-[#2A1D15] text-xs font-medium flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Foto</span>
            </button>
          </div>
        )}

        {/* Clean Brand Strip with Generous Spacing */}
        <div className="pt-6">
          <div className="flex items-center gap-2 overflow-x-auto snap-x no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => onSelectBrand('ALL')}
              className={`snap-start min-h-[40px] px-4 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-colors shrink-0 ${
                selectedBrandId === 'ALL'
                  ? 'bg-[#2A1D15] text-[#F9F4EB] font-semibold'
                  : 'bg-white text-[#2A1D15] hover:bg-[#EFE6D8] border border-[#E2D6C5] font-medium'
              }`}
            >
              Semua Brand
            </button>

            {brands.map((brand) => {
              const isSelected = selectedBrandId === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => onSelectBrand(isSelected ? 'ALL' : brand.id)}
                  className={`snap-start min-h-[40px] px-4 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-[#683B1E] text-[#F9F4EB] font-semibold'
                      : 'bg-white text-[#2A1D15] hover:bg-[#EFE6D8] border border-[#E2D6C5] font-medium'
                  }`}
                >
                  {brand.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consolidated Toolbar: Category Links + Promo Select + Product Count */}
        <div className="mt-5 pt-4 border-t border-[#E2D6C5]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Clean Category Text Links */}
          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`min-h-[36px] text-xs sm:text-sm whitespace-nowrap transition-colors shrink-0 ${
                    active
                      ? 'text-[#2A1D15] font-bold underline underline-offset-8 decoration-2 decoration-[#683B1E]'
                      : 'text-[#6F5E53] hover:text-[#2A1D15] font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right: Compact Discount Selector + Reset + Item Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetAllFilters}
                className="text-xs font-medium text-[#9E2A2B] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-white border border-[#E2D6C5] rounded-lg p-1">
              {DISCOUNT_TIERS.map((tier) => {
                const active = selectedDiscountTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => onSelectDiscountTier(tier.id)}
                    className={`min-h-[30px] px-2.5 rounded-md text-xs transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#2A1D15] text-[#F9F4EB] font-medium'
                        : 'text-[#6F5E53] hover:text-[#2A1D15]'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-[#6F5E53] tabular-nums whitespace-nowrap">
              {totalFilteredCount} produk
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
