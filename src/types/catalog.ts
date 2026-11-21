export type JastipCategory = 'MALL_BRAND' | 'EVENT_BAZAAR';

export type ProductCategory =
  | 'Sneakers & Shoes'
  | 'Tops'
  | 'Dresses'
  | 'Bottoms'
  | 'Bags'
  | 'Outerwear'
  | 'Accessories';

export interface OwnerProfile {
  fullName: string; // "Maritza Nalani Putri"
  nickname: string; // "Nala"
  roleTitle: string; // "Founder & Personal Shopper — SHEIFAST & @sheinaz.co"
  personalInstagramHandle: string; // "@maritzanlp"
  personalInstagramUrl: string; // "https://www.instagram.com/maritzanlp"
  creatorBadge: string; // "Kreator Digital"
  avatarUrl: string; // "/images/owner-nala.jpg"
  location: string; // "Bekasi - Indonesia"
  bankAccountInfo: string; // "BCA a.n. Maritza Nalani Putri"
  whatsappNumber: string; // "+62 895-0619-9324"
  shopeeUrl: string; // "https://id.shp.ee/8GCjACVM"
  bio: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  type: JastipCategory;
  badgeText?: string;
  logoInitials: string;
  contextBanner?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brandId: string;
  brandName: string;
  jastipType: JastipCategory;
  category: ProductCategory;
  imageUrl: string;
  dominantColors: string[];
  visualTags: string[];
  basePrice: number;
  jastipFee: number;
  discountPercent: number;
  sizes: string[];
  isAvailable: boolean;
  updatedAt: string;
  description?: string;
  storeLocation?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
  note?: string;
}

export interface VisualSearchResult {
  product: Product;
  similarityScore: number; // 0 to 100
  matchedBy: 'mobilenet+color' | 'color+tags';
}
