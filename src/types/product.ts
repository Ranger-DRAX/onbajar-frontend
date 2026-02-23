export type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type Discount =
  | null
  | {
      type: "percentage" | "fixed";
      value: number;
      startDate: string;
      endDate: string;
    };

export type SizeChartRow = { label: string; values: number[] };
export type SizeChart =
  | null
  | {
      unit: string;
      columns: string[];
      rows: SizeChartRow[];
    };

export type ProductApi = {
  _id: string;
  name: string;
  slug: string;
  category: Category;

  // Some items have pricing, one item has price (old data) — handle both
  pricing?: { sellingPrice: number; currency: string };
  price?: number;

  discount: Discount;
  images: string[];

  details: { description: string; bullets: string[] };

  hasSize: boolean;
  sizes: string[];
  sizeChart: SizeChart;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
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
  currency: string;
  images: string[];
  description: string;
  bullets: string[];
  sizes: string[];
  hasSize: boolean;
  sizeChart: SizeChart;
  discount: Discount;
  isActive: boolean;
};
