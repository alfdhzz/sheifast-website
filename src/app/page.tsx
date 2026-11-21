'use client';

import React, { useMemo, useState } from 'react';
import { Camera, RotateCcw, SearchX } from 'lucide-react';
import Navbar, { CatalogModeTab } from '@/components/Navbar';
import HeroAndFilters, { DiscountTierFilter } from '@/components/HeroAndFilters';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import ImageSearchModal from '@/components/ImageSearchModal';
import CartDrawer from '@/components/CartDrawer';
import TrustAndSocialSection from '@/components/TrustAndSocialSection';
import Footer from '@/components/Footer';
import FloatingCartBar from '@/components/FloatingCartBar';
import { useCatalog } from '@/context/CatalogContext';

export default function StorefrontPage() {
  const {
    products,
    visualSearchFilter,
    clearVisualSearchFilter,
    setIsVisualSearchOpen,
    showToast,
  } = useCatalog();

  const [activeMode, setActiveMode] = useState<CatalogModeTab>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDiscountTier, setSelectedDiscountTier] =
    useState<DiscountTierFilter>('ALL');

  const handleSelectMode = (mode: CatalogModeTab) => {
    setActiveMode(mode);
    if (mode === 'EVENT_BAZAAR') {
      setSelectedBrandId('event-bazaar');
    } else if (mode === 'MALL_BRAND' && selectedBrandId === 'event-bazaar') {
      setSelectedBrandId('ALL');
    } else if (mode === 'ALL' && selectedBrandId === 'event-bazaar') {
      setSelectedBrandId('ALL');
    }
  };

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
    if (brandId === 'event-bazaar') {
      setActiveMode('EVENT_BAZAAR');
    } else if (brandId !== 'ALL' && activeMode === 'EVENT_BAZAAR') {
      setActiveMode('MALL_BRAND');
    }
  };

  const handleResetAllFilters = () => {
    setActiveMode('ALL');
    setSearchQuery('');
    setSelectedBrandId('ALL');
    setSelectedCategory('All');
    setSelectedDiscountTier('ALL');
    clearVisualSearchFilter();
    showToast(
      'Semua Filter Direset',
      'Menampilkan kembali seluruh katalog produk SHEIFAST.',
      'info'
    );
  };

  const similarityMap = useMemo(() => {
    const map = new Map<string, number>();
    if (visualSearchFilter?.active) {
      for (const r of visualSearchFilter.results) {
        map.set(r.product.id, r.similarityScore);
      }
    }
    return map;
  }, [visualSearchFilter]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((product) => {
      if (!product.isAvailable) return false;

      if (activeMode !== 'ALL' && product.jastipType !== activeMode) {
        return false;
      }

      if (selectedBrandId !== 'ALL' && product.brandId !== selectedBrandId) {
        return false;
      }

      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      if (selectedDiscountTier === '50_PLUS' && product.discountPercent < 50) {
        return false;
      }
      if (selectedDiscountTier === '30_PLUS' && product.discountPercent < 30) {
        return false;
      }
      if (selectedDiscountTier === 'NORMAL' && product.discountPercent > 0) {
        return false;
      }

      if (q) {
        const haystack = [
          product.name,
          product.brandName,
          product.category,
          product.sku,
          ...(product.visualTags || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    if (visualSearchFilter?.active) {
      return [...list].sort(
        (a, b) => (similarityMap.get(b.id) || 0) - (similarityMap.get(a.id) || 0)
      );
    }

    return list;
  }, [
    products,
    activeMode,
    selectedBrandId,
    selectedCategory,
    selectedDiscountTier,
    searchQuery,
    visualSearchFilter,
    similarityMap,
  ]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F9F4EB]">
      {/* Sticky Navigation Header */}
      <Navbar activeMode={activeMode} onSelectMode={handleSelectMode} />

      {/* Clean Editorial Header & Filter Strip */}
      <HeroAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBrandId={selectedBrandId}
        onSelectBrand={handleSelectBrand}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedDiscountTier={selectedDiscountTier}
        onSelectDiscountTier={setSelectedDiscountTier}
        onResetAllFilters={handleResetAllFilters}
        totalFilteredCount={filteredProducts.length}
      />

      {/* Main Catalog Grid Section */}
      <main className="flex-1 py-7 sm:py-10">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
          {/* Responsive Product Grid:
              Mobile (<640px): grid-cols-2 gap-x-3.5 gap-y-6
              Tablet (640-1023px): sm:grid-cols-3 gap-x-5 gap-y-8
              Desktop (>=1024px): lg:grid-cols-4 gap-x-6 gap-y-9
          */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  similarityScore={
                    visualSearchFilter?.active
                      ? similarityMap.get(product.id)
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            /* Clean Minimal Empty State */
            <div className="my-10 p-8 sm:p-12 rounded-xl bg-white border border-[#E2D6C5] text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EFE6D8] text-[#683B1E] mx-auto flex items-center justify-center">
                <SearchX className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2A1D15]">
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-[#6F5E53]">
                  Belum ada produk yang sesuai dengan filter atau kata kunci pencarian.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="min-h-[44px] px-4 rounded-lg bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Semua Filter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisualSearchOpen(true)}
                  className="min-h-[44px] px-4 rounded-lg bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#D8CCBC] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Cari Pakai Foto</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Clean Editorial Owner Profile & How It Works */}
      <TrustAndSocialSection />

      {/* Footer */}
      <Footer />

      {/* Modals, Drawers & Floating Thumb-Reach Cart Bar */}
      <ProductDetailModal />
      <ImageSearchModal />
      <CartDrawer />
      <FloatingCartBar />
    </div>
  );
}
