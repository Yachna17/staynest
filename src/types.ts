export interface Hotel {
  id: number;
  userId: number;
  name: string;
  city: string;
  address: string;
  price: number;
  rooms: number;
  description: string;
  image: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
