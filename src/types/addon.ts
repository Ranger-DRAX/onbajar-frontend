export type Addon = {
  _id: string;
  name: string;
  image: string;
  description: string;
  note: string;
  price: number;
  currency: string;
  isActive: boolean;
};

export type AddonsResponse = {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Addon[];
};

/** The state we track per addon in the checkout UI */
export type AddonCartEntry = {
  addon: string; // addon _id
  quantity: number;
  customerNote?: string;
};
