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
  images: string[]; // full URLs from the server
  image: string | null; // first image, set by the server
}

// The fields the Add / Edit form works with (no id or userId, the server sets those)
export interface HotelFormValues {
  name: string;
  city: string;
  address: string;
  price: number;
  rooms: number;
  description: string;
  images: FileList; // files picked in the form
}

// A traveler books hotels, a manager owns hotels and confirms bookings
export type Role = "traveler" | "manager";

// Logged-in user (the API never sends the password back)
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
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
  role: Role;
  password: string;
  confirmPassword: string;
}

export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

// A booking exactly as the API returns it
export interface Booking {
  id: number;
  hotelId: number;
  name: string; // traveler who booked
  email: string;
  contactInfo: string;
  hotelName: string;
  hotelImage: string | null;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  guests: number;
  totalPrice: number;
  status: BookingStatus;
}

// The fields the booking form works with. hotelId is added when the request is sent,
// and the server fills in the rest (name, email, hotel details, price, status).
export interface BookingFormValues {
  contactInfo: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
