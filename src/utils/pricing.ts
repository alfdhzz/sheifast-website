import { CartItem, Product } from '@/types/catalog';

export interface PricingBreakdown {
  basePrice: number;
  jastipFee: number;
  discountPercent: number;
  normalTotalPrice: number;
  discountedStorePrice: number;
  finalPrice: number;
  savingsAmount: number;
  hasDiscount: boolean;
}

/**
 * Dynamic Pricing Formula (PRD Section 6.2):
 * - normalTotalPrice = basePrice + jastipFee
 * - discountedStorePrice = Math.round(basePrice * (1 - discountPercent / 100))
 * - finalPrice = discountedStorePrice + jastipFee
 */
export function calculateProductPricing(
  product: Pick<Product, 'basePrice' | 'jastipFee' | 'discountPercent'>
): PricingBreakdown {
  const safeBase = Math.max(0, Number(product.basePrice) || 0);
  const safeFee = Math.max(0, Number(product.jastipFee) || 0);
  const safeDiscount = Math.min(95, Math.max(0, Number(product.discountPercent) || 0));

  const normalTotalPrice = safeBase + safeFee;
  const discountedStorePrice = Math.round(safeBase * (1 - safeDiscount / 100));
  const finalPrice = discountedStorePrice + safeFee;
  const savingsAmount = Math.max(0, normalTotalPrice - finalPrice);

  return {
    basePrice: safeBase,
    jastipFee: safeFee,
    discountPercent: safeDiscount,
    normalTotalPrice,
    discountedStorePrice,
    finalPrice,
    savingsAmount,
    hasDiscount: safeDiscount > 0,
  };
}

/**
 * Formats integer amount to Indonesian Rupiah: "Rp 95.000"
 */
export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount || 0);
  const formatted = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

export function buildWhatsAppOrderUrl(params: {
  items: CartItem[];
  customerName: string;
  deliveryMethod: string;
  whatsappPhone?: string;
}): string {
  const { items, customerName, deliveryMethod } = params;
  const cleanPhone = '6289506199324';

  let grandTotal = 0;
  const itemLines = items.map((item, idx) => {
    const pricing = calculateProductPricing(item.product);
    const lineTotal = pricing.finalPrice * item.quantity;
    grandTotal += lineTotal;

    const discountNote =
      item.product.discountPercent > 0
        ? `Diskon ${item.product.discountPercent}% + Fee Jastip`
        : `Harga Store + Fee Jastip`;

    const lines = [
      `${idx + 1}. [${item.product.brandName.toUpperCase()}] ${item.product.name}`,
      `   - Size: ${item.selectedSize} | Qty: ${item.quantity}`,
      `   - Harga: ${formatRupiah(pricing.finalPrice)} (${discountNote})${
        item.quantity > 1 ? ` • Subtotal: ${formatRupiah(lineTotal)}` : ''
      }`,
    ];

    if (item.note && item.note.trim()) {
      lines.push(`   - Catatan: ${item.note.trim()}`);
    }

    return lines.join('\n');
  });

  const message = [
    `Halo Kak Nala (SHEIFAST)! Saya mau titip belanja list berikut:`,
    ``,
    itemLines.join('\n\n'),
    ``,
    `Estimasi Total: ${formatRupiah(grandTotal)}`,
    `Metode Pengiriman: ${deliveryMethod || 'Checkout via Shopee'}`,
    `Nama Pemesan: ${customerName.trim() || 'Customer SHEIFAST'}`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildQuickProductWhatsAppUrl(
  product: Product,
  selectedSize?: string,
  note?: string
): string {
  const pricing = calculateProductPricing(product);
  const cleanPhone = '6289506199324';
  const discountInfo =
    product.discountPercent > 0
      ? `Diskon ${product.discountPercent}% + Fee Jastip`
      : `Harga Normal + Fee Jastip`;

  const lines = [
    `Halo Kak Nala (SHEIFAST)! Saya mau tanya / titip produk ini:`,
    ``,
    `• [${product.brandName.toUpperCase()}] ${product.name}`,
    `• Size: ${selectedSize || product.sizes[0] || 'All Size'}`,
    `• Harga Jastip: ${formatRupiah(pricing.finalPrice)} (${discountInfo})`,
  ];

  if (note && note.trim()) {
    lines.push(`• Catatan: ${note.trim()}`);
  }

  lines.push(``, `Apakah stoknya masih tersedia di store Kak?`);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
