'use client';

import React from 'react';
import {
  Download,
  ExternalLink,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useCatalog } from '@/context/CatalogContext';
import { BUSINESS_LINKS } from '@/data/mockCatalog';

export default function Footer() {
  const { showToast } = useCatalog();

  return (
    <footer className="bg-[#2A1D15] text-[#F9F4EB] border-t border-[#683B1E]/40 pb-28 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b border-[#6F5E53]/30">
          {/* Column 1: Clean Brand Identity (No repeated titles, no crowded pills) */}
          <div className="md:col-span-5 space-y-5">
            <div className="inline-block bg-[#F9F4EB] px-4 py-2.5 rounded-xl">
              <BrandLogo size="sm" showBadge={false} showTagline={false} />
            </div>
            <p className="text-xs sm:text-sm text-[#EFE6D8]/75 leading-relaxed max-w-sm">
              Layanan personal shopper produk diskon mall &amp; event bazaar 100% original di Bekasi – Jakarta.
            </p>
            <p className="text-xs text-[#B5895A] font-medium tracking-wide">
              Part of @sheinaz.co • Bekasi, Indonesia
            </p>
          </div>

          {/* Column 2: Clean Social Channels */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#B5895A]">
              Sosial Media Resmi
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#EFE6D8]/85">
              <li>
                <a
                  href={BUSINESS_LINKS.instagramSheifast}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B5895A] inline-flex items-center gap-2.5 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#B5895A]" />
                  <span>@sheifast (Mall &amp; Brand)</span>
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS_LINKS.instagramSheinaz}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B5895A] inline-flex items-center gap-2.5 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#B5895A]" />
                  <span>@sheinaz.co (Event Bazaar)</span>
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS_LINKS.threadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B5895A] inline-flex items-center gap-2.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#B5895A]" />
                  <span>Threads @sheinaz.co</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Order via WhatsApp, Shopee & PDF */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#B5895A]">
              Pemesanan
            </h4>
            <div className="space-y-2.5">
              <a
                href={BUSINESS_LINKS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[42px] px-4 rounded-xl bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
              <a
                href={BUSINESS_LINKS.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[42px] px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#F9F4EB] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#B5895A]" />
                <span>Pengiriman Shopee</span>
              </a>
              <a
                href="/docs/Panduan-Alur-Pemesanan-SHEIFAST.pdf"
                download="Panduan-Alur-Pemesanan-SHEIFAST.pdf"
                onClick={() =>
                  showToast(
                    'Mengunduh Panduan Order (PDF)',
                    'File Panduan-Alur-Pemesanan-SHEIFAST.pdf sedang diunduh.',
                    'success'
                  )
                }
                className="w-full min-h-[42px] px-4 rounded-xl border border-[#6F5E53]/50 hover:border-[#B5895A] text-[#EFE6D8] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#B5895A]" />
                <span>Panduan Order (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#EFE6D8]/50">
          <p>© {new Date().getFullYear()} SHEIFAST. All rights reserved.</p>
          <p>Bekasi – Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
