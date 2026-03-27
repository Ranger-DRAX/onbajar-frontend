export type CartItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  size: string | null;
  qty: number;
};

export type CartStore = {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  addItem: (item: Omit<CartItem, "qty">) => void;
  updateQty: (id: string, size: string | null, qty: number) => void;
  removeItem: (id: string, size: string | null) => void;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};
