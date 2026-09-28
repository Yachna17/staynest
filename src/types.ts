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