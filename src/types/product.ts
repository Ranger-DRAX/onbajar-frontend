export type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type Video = {
  type: "youtube" | "custom";
  url: string;
};

export type Discount = null | {
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
};

export type SizeChartRow = { label: string; values: number[] };
export type SizeChart = null | {
  unit: string;
  columns: string[];
  rows: SizeChartRow[];
};

export type StockSummary = {
  managed: boolean;
  quantity?: number;
};

export type ProductApi = {
  _id: string;
  name: string;
  slug: string;
  category: Category;
  pricing?: { sellingPrice: number; currency: string };
  price?: number;
  effectivePrice?: number;
  discount: Discount;
  images: string[];
  video?: Video;
  details: { description: string; bullets: string[] };
  hasSize: boolean;
  sizes: string[];
  sizeChart: SizeChart;
  allowedAddons: unknown;
  isBestProduct?: boolean;
  purchaseCount?: number;
  isActive: boolean;
  stockSummary?: StockSummary;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ProductsResponse = {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: ProductApi[];
};

// Frontend-friendly product model (normalized)
export type Product = {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  price: number;
  effectivePrice: number;
  currency: string;
  images: string[];
  video?: Video;
  description: string;
  bullets: string[];
  sizes: string[];
  hasSize: boolean;
  sizeChart: SizeChart;
  discount: Discount;
  isBestProduct: boolean;
  purchaseCount: number;
  isActive: boolean;
  stockSummary?: StockSummary;
};
