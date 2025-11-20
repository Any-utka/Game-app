// src/types/User.tsx
export type User = {
  name: string;
  email: string;
  avatar?: string;
  isGuest?: boolean;
};
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};