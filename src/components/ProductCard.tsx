'use client';

import React from 'react';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/catalog';
import {
  buildQuickProductWhatsAppUrl,
  calculateProductPricing,
  formatRupiah,
} from '@/utils/pricing';
import { useCatalog } from '@/context/CatalogContext';

interface ProductCardProps {
  product: Product;
  similarityScore?: number;
}

export default function ProductCard({ product, similarityScore }: ProductCardProps) {
  const { addToCart, setActiveProductModal, showToast } = useCatalog();
  const pricing = calculateProductPricing(product);
  const quickWaUrl = buildQuickProductWhatsAppUrl(product, product.sizes[0]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'All Size';
    addToCart(product, defaultSize, 1);
  };

  return (
    <article
      onClick={() => setActiveProductModal(product)}
      className="group flex flex-col cursor-pointer"
    >
      {/* Clean Editorial Image Frame (aspect-[3/4]) */}
      <div className="relative aspect-[3/4] w-full rounded-xl bg-[#EFE6D8]/50 overflow-hidden border border-[#E2D6C5]/70">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Minimalist Top-Left Discount Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {pricing.hasDiscount ? (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#9E2A2B] text-white tracking-wide tabular-nums">
              -{product.discountPercent}%
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2A1D15] text-[#F9F4EB] tracking-wider uppercase">
              New
            </span>
          )}

          {typeof similarityScore === 'number' && (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2A1D15]/90 text-[#F9F4EB]">
              {similarityScore}% Mirip
            </span>
          )}
        </div>
      </div>

      {/* Clean, Airy Typography Details Below Image */}
      <div className="pt-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Brand Name Only (No cramped right-aligned size text) */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#857264] truncate">
            {product.brandName}
          </p>

          {/* Concise Product Name */}
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#2A1D15] truncate group-hover:text-[#683B1E] transition-colors">
            {product.name}
          </h3>

          {/* Clean Price Line */}
          <div className="pt-0.5 flex items-baseline gap-2">
            <span className="text-sm sm:text-[15px] font-bold text-[#683B1E] tabular-nums">
              {formatRupiah(pricing.finalPrice)}
            </span>
            {pricing.hasDiscount && (
              <span className="text-xs text-[#9C8D80] line-through tabular-nums">
                {formatRupiah(pricing.normalTotalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Clean Action Buttons: Shopping Cart Icon Button + WhatsApp Button */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="min-h-[40px] min-w-[44px] px-3 py-2 rounded-lg bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] flex items-center justify-center shrink-0 transition-colors"
            title="Tambah ke Keranjang"
            aria-label="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
          </button>

          <a
            href={quickWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              showToast(
                'Membuka WhatsApp...',
                `Menanyakan ${product.brandName} — ${product.name}`,
                'info'
              );
            }}
            className="flex-1 min-h-[40px] px-3 py-2 rounded-lg bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#D8CCBC] text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
            title="Order langsung via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#683B1E] shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
