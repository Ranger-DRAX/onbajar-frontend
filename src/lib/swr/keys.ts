export const swrKeys = {
  products: (page = 1, limit = 12) =>
    `/api/products?page=${page}&limit=${limit}` as const,

  product: (id: string) => `/api/products/${id}` as const,

  keyrings: (page = 1, limit = 12) =>
    `/api/keyrings?page=${page}&limit=${limit}` as const,

  keyring: (id: string) => `/api/keyrings/${id}` as const,

  addons: () => `/api/addons` as const,

  searchAll: () => `/api/search/all` as const,
} as const;
