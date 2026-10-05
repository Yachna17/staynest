import type { Hotel, HotelFormValues } from "../types";

// All hotel API calls. Reads are used with useQuery, changes with useMutation.
// Protected requests (add, edit, delete) send the JWT token in the Authorization header.

// GET /hotels -> every hotel (landing page)
export const getHotels = async (): Promise<Hotel[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels`);
  if (!res.ok) throw new Error(`Failed to fetch hotels (status ${res.status})`);
  return res.json();
};

// GET /hotels?userId=3 -> only the hotels of one user (dashboard)
export const getHotelsByUser = async (id: number): Promise<Hotel[]> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/hotels?userId=${id}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch hotels (status ${res.status})`);
  return res.json();
};

// DELETE /hotels/:id -> only the owner can delete
export const deleteHotel = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete hotel (status ${res.status})`);
  return res.json();
};

// POST /hotels -> the API needs userId in the body and it must match the logged-in user
export const createHotel = async (
  data: HotelFormValues,
  userId: number,
  token: string,
): Promise<Hotel> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, userId }),
  });
  if (!res.ok) throw new Error(`Failed to create hotel (status ${res.status})`);
  return res.json();
};

// GET /hotels/:id -> one hotel (used to fill the edit form)
export const getHotelsById = async (id: number): Promise<Hotel> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch hotel (status ${res.status})`);
  return res.json();
};

// PATCH /hotels/:id -> only the fields we send are changed
export const updateHotel = async (
  data: HotelFormValues,
  id: number,
  token: string,
): Promise<Hotel> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update hotel (status ${res.status})`);
  return res.json();
};
