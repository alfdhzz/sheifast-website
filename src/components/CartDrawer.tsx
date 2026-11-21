'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import {
  buildWhatsAppOrderUrl,
  calculateProductPricing,
  formatRupiah,
} from '@/utils/pricing';
import { BUSINESS_LINKS } from '@/data/mockCatalog';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    updateCartItemNote,
    removeFromCart,
    clearCart,
    totalCartItems,
    totalCartAmount,
    ownerProfile,
    requestConfirm,
    showToast,
  } = useCatalog();

  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState(
    'Checkout Pengiriman via Shopee'
  );

  if (!isCartOpen) return null;

  const whatsappCheckoutUrl = buildWhatsAppOrderUrl({
    items: cart,
    customerName,
    deliveryMethod,
  });

  const handleRequestClearCart = () => {
    requestConfirm({
      title: 'Kosongkan Seluruh Keranjang?',
      message: `Semua produk (${totalCartItems} item) di dalam Keranjang Anda akan dihapus. Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Kosongkan Semua',
      cancelLabel: 'Batal',
      variant: 'danger',
      onConfirm: () => {
        clearCart();
      },
    });
  };

  const handleRequestRemoveItem = (
    productId: string,
    productName: string,
    selectedSize: string
  ) => {
    requestConfirm({
      title: 'Hapus Produk dari Keranjang?',
      message: `Apakah Anda yakin ingin menghapus "${productName}" (Size: ${selectedSize}) dari keranjang Anda?`,
      confirmLabel: 'Ya, Hapus Produk',
      cancelLabel: 'Batal',
      variant: 'danger',
      onConfirm: () => {
        removeFromCart(productId, selectedSize);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-[#2A1D15]/60 backdrop-blur-xs"
      onClick={() => setIsCartOpen(false)}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[#F9F4EB] border-t sm:border-t-0 sm:border-l border-[#E2D6C5] rounded-t-2xl sm:rounded-none max-h-[90dvh] sm:max-h-[100dvh] sm:h-[100dvh] flex flex-col shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#E2D6C5] bg-[#F9F4EB]/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#683B1E] text-[#F9F4EB] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#2A1D15]">
                Keranjang ({totalCartItems})
              </h2>
              <p className="text-[11px] text-[#6F5E53]">
                Rincian belanja siap dikirim ke WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={handleRequestClearCart}
                className="min-h-[44px] px-2.5 rounded-lg text-xs font-semibold text-[#9E2A2B] hover:bg-[#EFE6D8]"
              >
                Kosongkan
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="min-h-[44px] min-w-[44px] rounded-full hover:bg-[#EFE6D8] flex items-center justify-center text-[#2A1D15]"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#EFE6D8] text-[#683B1E] mx-auto flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2A1D15]">
                Keranjang Masih Kosong
              </h3>
              <p className="text-xs sm:text-sm text-[#6F5E53] max-w-xs mx-auto">
                Yuk pilih sepatu, baju, atau tas diskon dari brand mall favoritmu atau gunakan fitur Cari Pakai Foto!
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="min-h-[44px] px-5 rounded-xl bg-[#683B1E] text-[#F9F4EB] text-xs sm:text-sm font-semibold"
              >
                Mulai Pilih Katalog
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const pricing = calculateProductPricing(item.product);
                  const subtotal = pricing.finalPrice * item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="p-3 rounded-xl bg-white border border-[#E2D6C5] shadow-xs space-y-2.5"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-20 rounded-lg object-cover border border-[#E2D6C5] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#683B1E]">
                              {item.product.brandName}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRequestRemoveItem(
                                  item.product.id,
                                  item.product.name,
                                  item.selectedSize
                                )
                              }
                              className="text-[#6F5E53] hover:text-[#9E2A2B] p-1"
                              aria-label="Hapus item"
                              title="Hapus produk ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <h4 className="text-xs sm:text-sm font-semibold text-[#2A1D15] line-clamp-1">
                            {item.product.name}
                          </h4>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-[#EFE6D8] text-[#683B1E] text-[11px] font-semibold">
                              Size: {item.selectedSize}
                            </span>
                            {pricing.hasDiscount && (
                              <span className="text-[11px] font-semibold text-[#9E2A2B]">
                                Diskon {item.product.discountPercent}%
                              </span>
                            )}
                          </div>

                          <div className="mt-1.5 flex items-baseline justify-between">
                            <span className="text-xs text-[#6F5E53] tabular-nums">
                              {formatRupiah(pricing.finalPrice)} / pcs
                            </span>
                            <span className="text-sm font-bold text-[#2A1D15] tabular-nums">
                              {formatRupiah(subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Editable Note */}
                      <div className="pt-2 border-t border-[#E2D6C5]/60 flex items-center gap-2">
                        <div className="flex items-center border border-[#E2D6C5] rounded-lg bg-[#F9F4EB]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedSize,
                                -1
                              )
                            }
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-[#2A1D15] hover:bg-[#EFE6D8]"
                            aria-label="Kurangi"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#2A1D15] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedSize,
                                1
                              )
                            }
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-[#2A1D15] hover:bg-[#EFE6D8]"
                            aria-label="Tambah"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.note || ''}
                          onChange={(e) =>
                            updateCartItemNote(
                              item.product.id,
                              item.selectedSize,
                              e.target.value
                            )
                          }
                          placeholder="Catatan (warna cadangan, dll)..."
                          className="flex-1 min-h-[38px] px-2.5 rounded-lg bg-[#F9F4EB] border border-[#E2D6C5] text-base sm:text-xs text-[#2A1D15] placeholder:text-[#6F5E53]/60 focus:outline-none focus:border-[#683B1E]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Details & Delivery Preference */}
              <div className="p-3.5 rounded-xl bg-[#EFE6D8]/75 border border-[#E2D6C5] space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D15] mb-1">
                    Nama Pemesan:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white border border-[#E2D6C5] text-base sm:text-sm text-[#2A1D15] focus:outline-none focus:border-[#683B1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D15] mb-1.5">
                    Preferensi Pengiriman:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Checkout Pengiriman via Shopee',
                      'Ekspedisi Reguler / Gosend Bekasi',
                    ].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setDeliveryMethod(method);
                          showToast(
                            'Metode Pengiriman Dipilih',
                            method,
                            'info'
                          );
                        }}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                          deliveryMethod === method
                            ? 'bg-[#683B1E] text-[#F9F4EB] border-[#683B1E]'
                            : 'bg-white text-[#2A1D15] border-[#E2D6C5] hover:bg-[#EFE6D8]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Truck className="w-4 h-4 shrink-0" />
                          {method}
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            deliveryMethod === method
                              ? 'border-[#F9F4EB] bg-[#F9F4EB]'
                              : 'border-[#6F5E53]'
                          }`}
                        >
                          {deliveryMethod === method && (
                            <span className="w-2 h-2 rounded-full bg-[#683B1E]" />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Bank Info */}
                <div className="flex items-center gap-2 text-xs text-[#683B1E] bg-[#F9F4EB] px-3.5 py-2.5 rounded-xl border border-[#E2D6C5]">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>
                    Rekening Resmi: <strong>{ownerProfile.bankAccountInfo}</strong>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E2D6C5] bg-[#F9F4EB] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6F5E53] block">
                  Estimasi Total (Termasuk Fee Jastip)
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#2A1D15] tabular-nums">
                  {formatRupiah(totalCartAmount)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#EFE6D8] text-[#683B1E] text-xs font-semibold">
                {totalCartItems} Item
              </span>
            </div>

            <a
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                showToast(
                  'Membuka WhatsApp...',
                  `Mengirim rincian ${totalCartItems} item Keranjang Anda ke WhatsApp.`,
                  'success'
                )
              }
              className="w-full min-h-[48px] px-4 rounded-xl bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Order ke WhatsApp</span>
            </a>

            <a
              href={BUSINESS_LINKS.shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 rounded-xl bg-white hover:bg-[#EFE6D8] text-[#683B1E] border border-[#E2D6C5] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Link Pengiriman via Shopee Resmi</span>
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
