'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';
import OwnerProfileCard from '@/components/OwnerProfileCard';
import { useCatalog } from '@/context/CatalogContext';

export default function TrustAndSocialSection() {
  const { showToast } = useCatalog();

  const steps = [
    {
      step: '01',
      title: 'Pilih Produk',
      desc: 'Pilih produk di katalog atau cari barang memakai foto.',
    },
    {
      step: '02',
      title: 'Kirim ke WhatsApp',
      desc: 'Masukkan ke keranjang lalu kirim rincian pesanan ke WhatsApp.',
    },
    {
      step: '03',
      title: 'Cek Stok di Store',
      desc: 'Ukuran dan kondisi barang dicek langsung di store beserta foto.',
    },
    {
      step: '04',
      title: 'Transfer & Kirim',
      desc: 'Pembayaran via rekening resmi dan pengiriman lewat Shopee.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-[#E2D6C5] bg-[#F9F4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* 1. Clean, Airy 4-Step Ordering Flow */}
        <div id="cara-order" className="scroll-mt-24 space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-[#E2D6C5]">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#683B1E]">
                Alur Pemesanan
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2A1D15] tracking-tight">
                Cara Kerja Titip Belanja
              </h2>
            </div>

            {/* Download Ordering Flow PDF Buttons */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2.5 shrink-0">
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
                className="min-h-[42px] px-4 rounded-xl bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Unduh PDF</span>
              </a>
              <a
                href="/docs/Panduan-Alur-Pemesanan-SHEIFAST.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-4 rounded-xl bg-white hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#D8CCBC] text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-[#683B1E] shrink-0" />
                <span>Lihat PDF</span>
              </a>
            </div>
          </div>

          {/* Spacious 4-Step Cards (1 col on small mobile, 2 col on tablet, 4 col on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2D6C5]/90 space-y-2.5"
              >
                <span className="text-xs font-bold tracking-widest text-[#683B1E] block">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-[#2A1D15]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6F5E53] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Dedicated Owner Section */}
        <div id="tentang-owner" className="scroll-mt-24 space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#683B1E]">
              Profil Founder
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A1D15] tracking-tight">
              Tentang Owner SHEIFAST
            </h2>
          </div>
          <OwnerProfileCard />
        </div>
      </div>
    </section>
  );
}
