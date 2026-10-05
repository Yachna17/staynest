// Shared TypeScript types, so the whole app agrees on the shape of the data.

// A hotel exactly as the API returns it
export interface Hotel {
  id: number;
  userId: number; // id of the user who owns this hotel
  name: string;
  city: string;
  address: string;
  price: number; // price per night
  rooms: number;
  description: string;
  image: string | null; // cover image URL (can be empty)
}

// The fields the Add / Edit form works with (no id or userId, the server sets those)
export interface HotelFormValues {
  name: string;
  city: string;
  address: string;
  price: number;
  rooms: number;
  description: string;
  image: string | null;
}

// Logged-in user (the API never sends the password back)
export interface User {
  id: number;
  name: string;
  email: string;
}

// Response of /login and /register
export interface AuthResponse {
  accessToken: string; // JWT sent in the Authorization header
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// confirmPassword is only used for validation in the form, it is not sent to the API
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
