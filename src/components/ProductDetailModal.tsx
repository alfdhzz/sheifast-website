'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import {
  buildQuickProductWhatsAppUrl,
  calculateProductPricing,
  formatRupiah,
} from '@/utils/pricing';

export default function ProductDetailModal() {
  const { activeProductModal, setActiveProductModal, addToCart, showToast } =
    useCatalog();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (activeProductModal) {
      setSelectedSize(activeProductModal.sizes[0] || 'All Size');
      setQuantity(1);
      setNote('');
    }
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const pricing = calculateProductPricing(product);
  const quickWaUrl = buildQuickProductWhatsAppUrl(product, selectedSize, note);

  const handleAddToBag = () => {
    addToCart(product, selectedSize, quantity, note);
    setActiveProductModal(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2A1D15]/55 backdrop-blur-xs p-0 sm:p-4"
      onClick={() => setActiveProductModal(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl bg-[#F9F4EB] border-t sm:border border-[#E2D6C5] rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Minimal Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#F9F4EB]/95 backdrop-blur-md px-5 py-3.5 border-b border-[#E2D6C5] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#683B1E]">
            {product.brandName}
          </span>
          <button
            type="button"
            onClick={() => setActiveProductModal(null)}
            className="w-9 h-9 rounded-full hover:bg-[#EFE6D8] flex items-center justify-center text-[#2A1D15]"
            aria-label="Tutup detail produk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Split Content */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-7">
          {/* Left: Product Image */}
          <div className="sm:col-span-5">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white border border-[#E2D6C5]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {pricing.hasDiscount && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-bold bg-[#9E2A2B] text-white">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Right: Clean Details, Price, Size & Action */}
          <div className="sm:col-span-7 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#2A1D15] leading-snug">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-2.5">
                  <span className="text-xl font-bold text-[#683B1E] tabular-nums">
                    {formatRupiah(pricing.finalPrice)}
                  </span>
                  {pricing.hasDiscount && (
                    <span className="text-xs text-[#6F5E53] line-through tabular-nums">
                      {formatRupiah(pricing.normalTotalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6F5E53] mt-1">
                  Harga store {formatRupiah(pricing.discountedStorePrice)} + fee jastip {formatRupiah(product.jastipFee)}
                </p>
              </div>

              {product.description && (
                <p className="text-xs sm:text-sm text-[#6F5E53] leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D15]">
                  Ukuran
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-[40px] min-w-[44px] px-3.5 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-[#683B1E] text-[#F9F4EB]'
                            : 'bg-white text-[#2A1D15] hover:bg-[#EFE6D8] border border-[#E2D6C5]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                <div className="sm:col-span-5 space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D15]">
                    Jumlah
                  </label>
                  <div className="flex items-center border border-[#E2D6C5] rounded-xl bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="min-h-[42px] min-w-[42px] flex items-center justify-center text-[#2A1D15] hover:bg-[#EFE6D8]"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-[#2A1D15] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="min-h-[42px] min-w-[42px] flex items-center justify-center text-[#2A1D15] hover:bg-[#EFE6D8]"
                      aria-label="Tambah jumlah"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D15]">
                    Catatan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Cadangan warna / ukuran..."
                    className="w-full min-h-[42px] px-3.5 rounded-xl bg-white border border-[#E2D6C5] text-base sm:text-xs text-[#2A1D15] placeholder:text-[#6F5E53]/60 focus:outline-none focus:border-[#683B1E]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E2D6C5] flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleAddToBag}
                className="w-full min-h-[46px] px-4 rounded-xl bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  Tambah ke Keranjang • {formatRupiah(pricing.finalPrice * quantity)}
                </span>
              </button>

              <a
                href={quickWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  showToast(
                    'Membuka WhatsApp...',
                    `Menanyakan ${product.brandName} — ${product.name} (Size: ${selectedSize})`,
                    'info'
                  )
                }
                className="w-full min-h-[44px] px-4 rounded-xl bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#E2D6C5] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#683B1E]" />
                <span>Order Langsung via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
