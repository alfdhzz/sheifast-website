'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Brand,
  CartItem,
  OwnerProfile,
  Product,
  VisualSearchResult,
} from '@/types/catalog';
import { BRANDS, INITIAL_OWNER_PROFILE, INITIAL_PRODUCTS } from '@/data/mockCatalog';
import { calculateProductPricing } from '@/utils/pricing';

interface VisualSearchState {
  active: boolean;
  results: VisualSearchResult[];
  previewUrl: string;
  extractedColors: string[];
  detectedLabels: string[];
}

export type AlertVariant = 'success' | 'danger' | 'info' | 'warning';

export interface ToastState {
  id: number;
  text: string;
  subtext?: string;
  variant: AlertVariant;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ConfirmDialogState {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
}

interface CatalogContextValue {
  products: Product[];
  brands: Brand[];
  ownerProfile: OwnerProfile;
  cart: CartItem[];
  totalCartItems: number;
  totalCartAmount: number;
  isHydrated: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isVisualSearchOpen: boolean;
  setIsVisualSearchOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  visualSearchFilter: VisualSearchState | null;
  setVisualSearchFilter: (state: VisualSearchState | null) => void;
  clearVisualSearchFilter: () => void;
  toastMessage: ToastState | null;
  dismissToast: () => void;
  showToast: (
    text: string,
    subtext?: string,
    variant?: AlertVariant,
    actionLabel?: string,
    onAction?: () => void
  ) => void;
  confirmDialog: ConfirmDialogState | null;
  requestConfirm: (dialog: ConfirmDialogState) => void;
  closeConfirm: () => void;
  addToCart: (product: Product, selectedSize: string, quantity?: number, note?: string) => void;
  updateCartQuantity: (productId: string, selectedSize: string, delta: number) => void;
  updateCartItemNote: (productId: string, selectedSize: string, note: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  updateProductDiscount: (productId: string, discountPercent: number) => void;
  batchUpdateProductDiscount: (productIds: string[], discountPercent: number) => void;
  brandUpdateProductDiscount: (brandId: string, discountPercent: number) => void;
  toggleProductAvailability: (productId: string) => void;
  updateProductDetails: (productId: string, patch: Partial<Product>) => void;
  addNewProduct: (newProd: Omit<Product, 'id' | 'updatedAt'>) => Product;
  deleteProduct: (productId: string) => void;
  resetCatalogToDefault: () => void;
  exportCatalogJson: () => string;
  importCatalogJson: (jsonString: string) => { success: boolean; message: string };
  updateOwnerProfile: (patch: Partial<OwnerProfile>) => void;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'sheifast_products_v3',
  OWNER: 'sheifast_owner_v3',
  CART: 'sheifast_cart_v3',
};

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(INITIAL_OWNER_PROFILE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [visualSearchFilter, setVisualSearchFilter] = useState<VisualSearchState | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const showToast = useCallback(
    (
      text: string,
      subtext?: string,
      variant: AlertVariant = 'success',
      actionLabel?: string,
      onAction?: () => void
    ) => {
      const id = Date.now();
      setToastMessage({ id, text, subtext, variant, actionLabel, onAction });
      setTimeout(() => {
        setToastMessage((prev) => (prev?.id === id ? null : prev));
      }, 3600);
    },
    []
  );

  const requestConfirm = useCallback((dialog: ConfirmDialogState) => {
    setConfirmDialog(dialog);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }

      const savedOwner = localStorage.getItem(STORAGE_KEYS.OWNER);
      if (savedOwner) {
        const parsedOwner = JSON.parse(savedOwner);
        if (parsedOwner && parsedOwner.fullName) {
          setOwnerProfile({ ...INITIAL_OWNER_PROFILE, ...parsedOwner });
        }
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch {
      // ignore malformed storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist products
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore quota error
    }
  }, [products, isHydrated]);

  // Persist owner profile
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.OWNER, JSON.stringify(ownerProfile));
    } catch {
      // ignore
    }
  }, [ownerProfile, isHydrated]);

  // Persist cart
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, isHydrated]);

  // Sync cart items whenever product prices/discounts change
  useEffect(() => {
    if (!isHydrated) return;
    setCart((prevCart) =>
      prevCart.map((item) => {
        const latestProd = products.find((p) => p.id === item.product.id);
        return latestProd ? { ...item, product: latestProd } : item;
      })
    );
  }, [products, isHydrated]);

  const addToCart = useCallback(
    (product: Product, selectedSize: string, quantity = 1, note?: string) => {
      const sizeToUse = selectedSize || product.sizes[0] || 'All Size';
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.product.id === product.id && i.selectedSize === sizeToUse
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
            note: note && note.trim() ? note.trim() : updated[existingIndex].note,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            selectedSize: sizeToUse,
            quantity,
            note: note?.trim() || '',
          },
        ];
      });
      showToast(
        'Ditambahkan ke Keranjang',
        `${product.brandName} — ${product.name} (Size: ${sizeToUse}, ${quantity}x)`,
        'success',
        'Lihat Keranjang',
        () => setIsCartOpen(true)
      );
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string, selectedSize: string) => {
      const targetItem = cart.find(
        (item) => item.product.id === productId && item.selectedSize === selectedSize
      );
      setCart((prev) =>
        prev.filter(
          (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
        )
      );
      if (targetItem) {
        showToast(
          'Produk Dihapus dari Keranjang',
          `${targetItem.product.brandName} — ${targetItem.product.name} (Size: ${selectedSize}) telah dihapus.`,
          'danger'
        );
      }
    },
    [cart, showToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, selectedSize: string, delta: number) => {
      const targetItem = cart.find(
        (item) => item.product.id === productId && item.selectedSize === selectedSize
      );
      if (!targetItem) return;

      const nextQty = targetItem.quantity + delta;
      if (nextQty <= 0) {
        requestConfirm({
          title: 'Hapus Produk dari Keranjang?',
          message: `Apakah Anda yakin ingin menghapus "${targetItem.product.name}" (Size: ${selectedSize}) dari keranjang Anda?`,
          confirmLabel: 'Ya, Hapus Produk',
          cancelLabel: 'Batal',
          variant: 'danger',
          onConfirm: () => {
            removeFromCart(productId, selectedSize);
          },
        });
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity: nextQty }
            : item
        )
      );

      if (delta > 0) {
        showToast(
          'Jumlah Produk Ditambah',
          `${targetItem.product.name} (Size: ${selectedSize}) menjadi ${nextQty} pcs`,
          'success'
        );
      } else {
        showToast(
          'Jumlah Produk Dikurangi',
          `${targetItem.product.name} (Size: ${selectedSize}) menjadi ${nextQty} pcs`,
          'info'
        );
      }
    },
    [cart, removeFromCart, requestConfirm, showToast]
  );

  const updateCartItemNote = useCallback(
    (productId: string, selectedSize: string, note: string) => {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.selectedSize === selectedSize
            ? { ...item, note }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    setCart([]);
    showToast(
      'Keranjang Dikosongkan',
      `Seluruh produk (${count} item) telah dihapus dari keranjang.`,
      'danger'
    );
  }, [cart, showToast]);

  const updateProductDiscount = useCallback(
    (productId: string, discountPercent: number) => {
      const clamped = Math.min(95, Math.max(0, Math.round(discountPercent)));
      const now = new Date().toISOString();
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, discountPercent: clamped, updatedAt: now } : p
        )
      );
      showToast(`Diskon diperbarui ke ${clamped}%`, undefined, 'success');
    },
    [showToast]
  );

  const batchUpdateProductDiscount = useCallback(
    (productIds: string[], discountPercent: number) => {
      if (!productIds.length) return;
      const clamped = Math.min(95, Math.max(0, Math.round(discountPercent)));
      const idSet = new Set(productIds);
      const now = new Date().toISOString();
      setProducts((prev) =>
        prev.map((p) =>
          idSet.has(p.id) ? { ...p, discountPercent: clamped, updatedAt: now } : p
        )
      );
      showToast(
        `Diskon Massal ${clamped}% Diterapkan`,
        `${productIds.length} produk berhasil diperbarui sekaligus`,
        'success'
      );
    },
    [showToast]
  );

  const brandUpdateProductDiscount = useCallback(
    (brandId: string, discountPercent: number) => {
      const clamped = Math.min(95, Math.max(0, Math.round(discountPercent)));
      const now = new Date().toISOString();
      let count = 0;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.brandId === brandId) {
            count += 1;
            return { ...p, discountPercent: clamped, updatedAt: now };
          }
          return p;
        })
      );
      const brandObj = BRANDS.find((b) => b.id === brandId);
      showToast(
        `Diskon Brand ${brandObj?.name || brandId} -> ${clamped}%`,
        `${count} produk brand berhasil diperbarui`,
        'success'
      );
    },
    [showToast]
  );

  const toggleProductAvailability = useCallback((productId: string) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable, updatedAt: now } : p
      )
    );
  }, []);

  const updateProductDetails = useCallback(
    (productId: string, patch: Partial<Product>) => {
      const now = new Date().toISOString();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...patch, updatedAt: now } : p))
      );
      showToast('Data produk berhasil disimpan', undefined, 'success');
    },
    [showToast]
  );

  const addNewProduct = useCallback(
    (newProd: Omit<Product, 'id' | 'updatedAt'>): Product => {
      const created: Product = {
        ...newProd,
        id: `prod-custom-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [created, ...prev]);
      showToast('Produk baru berhasil ditambahkan ke katalog', created.name, 'success');
      return created;
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('Produk dihapus dari katalog', undefined, 'danger');
    },
    [showToast]
  );

  const resetCatalogToDefault = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setOwnerProfile(INITIAL_OWNER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.OWNER);
    showToast('Katalog & Profil di-reset ke data awal', undefined, 'info');
  }, [showToast]);

  const exportCatalogJson = useCallback(() => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        brand: 'SHEIFAST — Part of @sheinaz.co',
        ownerProfile,
        products,
      },
      null,
      2
    );
  }, [ownerProfile, products]);

  const importCatalogJson = useCallback(
    (jsonString: string): { success: boolean; message: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          showToast('Import Katalog Berhasil', `${parsed.length} produk dimuat`, 'success');
          return { success: true, message: `${parsed.length} produk berhasil diimpor.` };
        }
        if (parsed && Array.isArray(parsed.products)) {
          setProducts(parsed.products);
          if (parsed.ownerProfile && parsed.ownerProfile.fullName) {
            setOwnerProfile({ ...INITIAL_OWNER_PROFILE, ...parsed.ownerProfile });
          }
          showToast(
            'Import Katalog & Profil Berhasil',
            `${parsed.products.length} produk dimuat`,
            'success'
          );
          return {
            success: true,
            message: `${parsed.products.length} produk berhasil diimpor.`,
          };
        }
        return {
          success: false,
          message: 'Format JSON tidak valid. Pastikan berisi array produk SHEIFAST.',
        };
      } catch {
        return {
          success: false,
          message: 'Gagal membaca file JSON. Pastikan format JSON valid.',
        };
      }
    },
    [showToast]
  );

  const updateOwnerProfile = useCallback(
    (patch: Partial<OwnerProfile>) => {
      setOwnerProfile((prev) => ({ ...prev, ...patch }));
      showToast('Profil Owner berhasil diperbarui', undefined, 'success');
    },
    [showToast]
  );

  const clearVisualSearchFilter = useCallback(() => {
    setVisualSearchFilter(null);
    showToast(
      'Pencarian Foto Direset',
      'Kembali menampilkan seluruh katalog produk SHEIFAST.',
      'info'
    );
  }, [showToast]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => {
    const pricing = calculateProductPricing(item.product);
    return sum + pricing.finalPrice * item.quantity;
  }, 0);

  return (
    <CatalogContext.Provider
      value={{
        products,
        brands: BRANDS,
        ownerProfile,
        cart,
        totalCartItems,
        totalCartAmount,
        isHydrated,
        isCartOpen,
        setIsCartOpen,
        isVisualSearchOpen,
        setIsVisualSearchOpen,
        activeProductModal,
        setActiveProductModal,
        visualSearchFilter,
        setVisualSearchFilter,
        clearVisualSearchFilter,
        toastMessage,
        dismissToast,
        showToast,
        confirmDialog,
        requestConfirm,
        closeConfirm,
        addToCart,
        updateCartQuantity,
        updateCartItemNote,
        removeFromCart,
        clearCart,
        updateProductDiscount,
        batchUpdateProductDiscount,
        brandUpdateProductDiscount,
        toggleProductAvailability,
        updateProductDetails,
        addNewProduct,
        deleteProduct,
        resetCatalogToDefault,
        exportCatalogJson,
        importCatalogJson,
        updateOwnerProfile,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
