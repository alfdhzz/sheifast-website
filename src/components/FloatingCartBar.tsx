'use client';

import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import { formatRupiah } from '@/utils/pricing';

export default function FloatingCartBar() {
  const {
    totalCartItems,
    totalCartAmount,
    setIsCartOpen,
    toastMessage,
    dismissToast,
    confirmDialog,
    closeConfirm,
  } = useCatalog();

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'danger':
        return {
          container: 'bg-white border-[#E2D6C5] text-[#2A1D15]',
          iconBox: 'bg-[#9E2A2B]/10 text-[#9E2A2B]',
          icon: <Trash2 className="w-4 h-4" />,
        };
      case 'info':
        return {
          container: 'bg-white border-[#E2D6C5] text-[#2A1D15]',
          iconBox: 'bg-[#EFE6D8] text-[#683B1E]',
          icon: <Info className="w-4 h-4" />,
        };
      case 'warning':
        return {
          container: 'bg-white border-[#E2D6C5] text-[#2A1D15]',
          iconBox: 'bg-[#B5895A]/20 text-[#683B1E]',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      default:
        return {
          container: 'bg-white border-[#E2D6C5] text-[#2A1D15]',
          iconBox: 'bg-[#683B1E]/10 text-[#683B1E]',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
    }
  };

  return (
    <>
      {/* 1. Modern Clean Alert Notification Banner (z-[90]) */}
      {toastMessage && (
        <div
          key={toastMessage.id}
          className="fixed top-5 right-4 left-4 sm:left-auto sm:right-6 sm:w-[380px] z-[90] pointer-events-auto"
          role="alert"
        >
          {(() => {
            const style = getVariantStyles(toastMessage.variant);
            return (
              <div
                className={`p-4 rounded-xl border shadow-editorial-lg flex items-start gap-3.5 transition-all ${style.container}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.iconBox}`}
                >
                  {style.icon}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-[#2A1D15] leading-snug">
                    {toastMessage.text}
                  </p>
                  {toastMessage.subtext && (
                    <p className="text-xs text-[#6F5E53] mt-1 leading-relaxed">
                      {toastMessage.subtext}
                    </p>
                  )}

                  {toastMessage.actionLabel && toastMessage.onAction && (
                    <button
                      type="button"
                      onClick={() => {
                        toastMessage.onAction?.();
                        dismissToast();
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#683B1E] hover:underline"
                    >
                      <span>{toastMessage.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={dismissToast}
                  className="w-7 h-7 rounded-lg hover:bg-[#EFE6D8] flex items-center justify-center text-[#6F5E53] hover:text-[#2A1D15] shrink-0"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. Clean Confirmation Alert Dialog (z-[95]) */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-[95] bg-[#2A1D15]/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeConfirm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white border border-[#E2D6C5] p-6 shadow-2xl space-y-5"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-[#9E2A2B]/10 text-[#9E2A2B]'
                    : 'bg-[#EFE6D8] text-[#683B1E]'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#2A1D15]">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6F5E53] leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2D6C5]">
              <button
                type="button"
                onClick={closeConfirm}
                className="min-h-[40px] px-4 rounded-lg bg-[#F9F4EB] hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#E2D6C5] text-xs font-semibold transition-colors"
              >
                {confirmDialog.cancelLabel || 'Batal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  closeConfirm();
                }}
                className={`min-h-[40px] px-4 rounded-lg text-white text-xs font-semibold transition-colors ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-[#9E2A2B] hover:bg-[#7E2021]'
                    : 'bg-[#683B1E] hover:bg-[#4F2B14]'
                }`}
              >
                {confirmDialog.confirmLabel || 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modern Clean Single-Line Floating Cart Bar */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-5 inset-x-0 z-40 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full min-h-[54px] px-5 py-3 rounded-full bg-[#2A1D15] hover:bg-[#683B1E] text-[#F9F4EB] shadow-editorial-lg flex items-center justify-between gap-4 transition-colors"
            >
              {/* Left: Clean Cart Icon + Item Count + Divider + Total Price */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#B5895A] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-[#EFE6D8] whitespace-nowrap">
                    {totalCartItems} Produk
                  </span>
                </div>

                <span className="w-[1px] h-4 bg-[#6F5E53]/50" />

                <span className="text-sm sm:text-base font-bold text-white tracking-tight tabular-nums whitespace-nowrap">
                  {formatRupiah(totalCartAmount)}
                </span>
              </div>

              {/* Right: Clean CTA Link */}
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F9F4EB] whitespace-nowrap shrink-0">
                <span>Keranjang</span>
                <ArrowRight className="w-4 h-4 text-[#B5895A]" />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
