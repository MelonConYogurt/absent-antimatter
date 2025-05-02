export interface client {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  active: boolean;
}

interface Metadata {
  page: number;
  size: number;
  total: number;
}

export interface responseClient {
  data?: client[];
  success: boolean;
  error?: string;
  metadata?: Metadata;
}
