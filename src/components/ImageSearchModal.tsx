'use client';

import React, { useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import { VISUAL_SEARCH_SAMPLE_PHOTOS } from '@/data/mockCatalog';
import { analyzeImageAndRankProducts } from '@/utils/visualSearch';
import { calculateProductPricing, formatRupiah } from '@/utils/pricing';
import { VisualSearchResult } from '@/types/catalog';

export default function ImageSearchModal() {
  const {
    products,
    isVisualSearchOpen,
    setIsVisualSearchOpen,
    setVisualSearchFilter,
    clearVisualSearchFilter,
    addToCart,
    setActiveProductModal,
    showToast,
  } = useCatalog();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [detectedLabels, setDetectedLabels] = useState<string[]>([]);
  const [matchedResults, setMatchedResults] = useState<VisualSearchResult[]>([]);
  const [usedTfModel, setUsedTfModel] = useState<boolean>(false);

  if (!isVisualSearchOpen) return null;

  const runVisualAnalysis = (params: {
    srcUrl: string;
    hintKeywords?: string[];
    fallbackColors?: string[];
    fileName?: string;
  }) => {
    setIsAnalyzing(true);
    setPreviewUrl(params.srcUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const analysis = await analyzeImageAndRankProducts({
        imageElement: img,
        products,
        hintKeywords: params.hintKeywords,
        fallbackColors: params.fallbackColors,
        fileName: params.fileName,
      });

      setExtractedColors(analysis.extractedColors);
      setDetectedLabels(analysis.detectedLabels);
      setMatchedResults(analysis.results.slice(0, 6));
      setUsedTfModel(analysis.usedMobileNet);
      setIsAnalyzing(false);

      // Also update main catalog visual search state
      setVisualSearchFilter({
        active: true,
        results: analysis.results,
        previewUrl: params.srcUrl,
        extractedColors: analysis.extractedColors,
        detectedLabels: analysis.detectedLabels,
      });
      showToast(
        'Pencarian Foto Berhasil',
        `Ditemukan ${analysis.results.length} produk yang cocok dengan foto Anda.`,
        'success'
      );
    };

    img.onerror = async () => {
      // Fallback if CORS blocks canvas read on external image
      const analysis = await analyzeImageAndRankProducts({
        imageElement: img,
        products,
        hintKeywords: params.hintKeywords || ['sneakers', 'fashion'],
        fallbackColors: params.fallbackColors || ['#EFE6D8', '#683B1E'],
        fileName: params.fileName,
      });
      setExtractedColors(analysis.extractedColors);
      setDetectedLabels(analysis.detectedLabels);
      setMatchedResults(analysis.results.slice(0, 6));
      setUsedTfModel(false);
      setIsAnalyzing(false);

      setVisualSearchFilter({
        active: true,
        results: analysis.results,
        previewUrl: params.srcUrl,
        extractedColors: analysis.extractedColors,
        detectedLabels: analysis.detectedLabels,
      });
      showToast(
        'Pencarian Foto Berhasil',
        `Ditemukan ${analysis.results.length} produk yang cocok dengan foto Anda.`,
        'success'
      );
    };

    img.src = params.srcUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        runVisualAnalysis({
          srcUrl: reader.result,
          fileName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        runVisualAnalysis({
          srcUrl: reader.result,
          fileName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setMatchedResults([]);
    setExtractedColors([]);
    setDetectedLabels([]);
    clearVisualSearchFilter();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2A1D15]/60 backdrop-blur-xs p-0 sm:p-4"
      onClick={() => setIsVisualSearchOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl bg-[#F9F4EB] border-t sm:border border-[#E2D6C5] rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#F9F4EB]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-[#E2D6C5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#683B1E] text-[#F9F4EB] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#2A1D15]">
                Cari Pakai Foto (Visual Search AI)
              </h2>
              <p className="text-[11px] sm:text-xs text-[#6F5E53]">
                Upload / foto screenshot sepatu, baju, atau tas dari Instagram untuk cari di katalog SHEIFAST
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsVisualSearchOpen(false)}
            className="min-h-[44px] min-w-[44px] -mr-2 rounded-full hover:bg-[#EFE6D8] flex items-center justify-center text-[#2A1D15]"
            aria-label="Tutup Visual Search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Upload / Camera Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#B5895A] hover:border-[#683B1E] rounded-2xl bg-[#EFE6D8]/50 hover:bg-[#EFE6D8]/80 p-5 text-center cursor-pointer transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-[#683B1E] text-[#F9F4EB] mx-auto flex items-center justify-center mb-2.5 shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#2A1D15]">
              Tap untuk Ambil Foto Kamera / Pilih dari Galeri
            </p>
            <p className="text-xs text-[#6F5E53] mt-1">
              Mendukung JPG, PNG, WebP • Diproses 100% aman di browser Anda (TensorFlow.js MobileNet + Color Palette)
            </p>
          </div>

          {/* 3 Clickable Sample Photos for Instant Testing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F5E53]">
                Atau Coba Instan dengan 3 Foto Contoh Ini:
              </span>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-[#9E2A2B] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Pencarian Foto
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {VISUAL_SEARCH_SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() =>
                    runVisualAnalysis({
                      srcUrl: sample.imageUrl,
                      hintKeywords: sample.keywords,
                      fallbackColors: sample.fallbackColors,
                      fileName: sample.label,
                    })
                  }
                  className="group min-h-[44px] p-2 rounded-xl bg-white border border-[#E2D6C5] hover:border-[#683B1E] text-left flex items-center gap-2.5 transition-all shadow-xs"
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.label}
                    className="w-11 h-11 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] sm:text-xs font-semibold text-[#2A1D15] truncate">
                      {sample.label}
                    </span>
                    <span className="block text-[10px] text-[#683B1E] font-medium">
                      Klik Tes AI →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Skeleton Loading State during TensorFlow / Canvas extraction */}
          {isAnalyzing && (
            <div className="p-5 rounded-2xl bg-white border border-[#E2D6C5] space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#683B1E] animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#2A1D15]">
                    Menganalisis fitur visual &amp; palet warna dominan...
                  </p>
                  <p className="text-xs text-[#6F5E53]">
                    Mencocokkan dengan katalog diskon SHEIFAST (@sheifast &amp; @sheinaz.co)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-36 rounded-xl bg-[#EFE6D8] animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {!isAnalyzing && previewUrl && matchedResults.length > 0 && (
            <div className="space-y-4">
              {/* Uploaded Thumbnail & Extracted Metadata */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2D6C5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Uploaded"
                    className="w-14 h-14 rounded-xl object-cover border border-[#E2D6C5]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#683B1E] uppercase tracking-wider">
                        Foto Referensi Anda
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE6D8] text-[#683B1E]">
                        {usedTfModel ? 'TensorFlow MobileNet + Color' : 'Color & Visual Match'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6F5E53] mt-0.5">
                      Fitur terdeteksi:{' '}
                      <strong className="text-[#2A1D15]">
                        {detectedLabels.slice(0, 3).join(', ')}
                      </strong>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-[#6F5E53]">Palet Warna:</span>
                      {extractedColors.map((hex, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-black/20 inline-block"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVisualSearchOpen(false)}
                  className="min-h-[44px] px-4 rounded-xl bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] text-xs font-semibold flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lihat Semua di Katalog</span>
                </button>
              </div>

              {/* Top Matching Products Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2A1D15] mb-2.5">
                  Katalog SHEIFAST Paling Mirip ({matchedResults.length} Produk Teratas):
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {matchedResults.map(({ product, similarityScore }) => {
                    const pricing = calculateProductPricing(product);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl border border-[#E2D6C5] overflow-hidden flex flex-col justify-between shadow-xs"
                      >
                        <div
                          onClick={() => {
                            setIsVisualSearchOpen(false);
                            setActiveProductModal(product);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="relative aspect-[4/4] bg-[#EFE6D8]">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A1D15]/90 text-[#F9F4EB] flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-[#B5895A]" />
                              {similarityScore}% Mirip
                            </span>
                            {pricing.hasDiscount && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9E2A2B] text-white">
                                -{product.discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="p-2.5">
                            <span className="text-[10px] font-bold uppercase text-[#683B1E]">
                              {product.brandName}
                            </span>
                            <h4 className="text-xs font-semibold text-[#2A1D15] line-clamp-1 mt-0.5">
                              {product.name}
                            </h4>
                            <div className="text-xs font-bold text-[#2A1D15] tabular-nums mt-1">
                              {formatRupiah(pricing.finalPrice)}
                            </div>
                          </div>
                        </div>
                        <div className="px-2.5 pb-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              addToCart(product, product.sizes[0] || 'All Size', 1)
                            }
                            className="w-full min-h-[40px] rounded-lg bg-[#EFE6D8] hover:bg-[#683B1E] text-[#683B1E] hover:text-[#F9F4EB] text-xs font-semibold transition-colors"
                          >
                            + Keranjang
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
