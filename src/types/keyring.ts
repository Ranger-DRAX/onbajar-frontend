import type { Discount } from "./product";

export type KeyringCategory = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type KeyringPersonalisationField = {
  type: "text" | "image";
  label: string;
  required: boolean;
};

export type KeyringDetails = {
  description: string;
  features: string[];
  material: string;
  dimensions: string;
  weight: number;
};

export type KeyringApi = {
  _id: string;
  name: string;
  slug: string;
  keyringType: string;
  colors: string[];
  details: KeyringDetails;
  pricing: { sellingPrice: number; currency: string };
  discount: Discount;
  video: null | { type: string; url: string };
  images: string[];
  category: KeyringCategory;
  isActive: boolean;
  isBestProduct: boolean;
  personalisation: KeyringPersonalisationField[];
  purchaseCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type KeyringsResponse = {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: KeyringApi[];
};

/** Frontend-normalised keyring (compatible with ProductCard) */
export type Keyring = {
  id: string;
  slug: string;
  title: string;
  keyringType: string;
  colors: string[];
  categoryName: string;
  categorySlug: string;
  price: number;
  effectivePrice: number;
  currency: string;
  images: string[];
  video: null | { type: string; url: string };
  description: string;
  features: string[];
  material: string;
  dimensions: string;
  weight: number;
  discount: Discount;
  isActive: boolean;
  isBestProduct: boolean;
  personalisation: KeyringPersonalisationField[];
  purchaseCount: number;
};
