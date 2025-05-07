export interface Product {
  id: number;
  name: string;
  stock: number;
  reference: string;
  category_id: number;
  price: number;
  created_at: string;
  supplier_id: string;
  active: boolean;
}

export interface Metadata {
  page: number;
  size: number;
  total: number;
}

export interface responseProducts {
  data?: Product[];
  success: boolean;
  error?: string;
  metadata?: Metadata;
}
