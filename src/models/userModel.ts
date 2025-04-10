export interface User {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  active: boolean;
}

export interface FormUser {
  id?: number;
  name: string;
  phone_number: string;
  email: string;
}

interface Metadata {
  page: number;
  size: number;
  total: number;
}

export interface responseUser {
  data?: User[];
  success: boolean;
  error?: string;
  metadata?: Metadata;
}
