export interface Sale {
  id: number;
  client_id: number;
  user_id: number;
  sale_date: string;
  total: number;
}

export interface Metadata {
  page: number;
  size: number;
  total: number;
}

export interface responseSales {
  data?: Sale[];
  success: boolean;
  error?: string;
  metadata?: Metadata;
}
