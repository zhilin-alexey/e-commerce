export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterProps {
  setErrors: (errors: any[]) => void;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginProps {
  setErrors: (errors: any[]) => void;
  setStatus: (status: string | null) => void;
  email: string;
  password: string;
}

export interface ForgotPasswordProps {
  setErrors: (errors: any[]) => void;
  setStatus: (status: string | null) => void;
  email: string;
}

export interface ResetPasswordProps {
  setErrors: (errors: any[]) => void;
  setStatus: (status: string | null) => void;
  password: string;
  password_confirmation: string;
}

export interface ResendEmailVerificationProps {
  setStatus: (status: string) => void;
}

export interface Product {
  quantity: number;
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  width: number;
  height: number;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}