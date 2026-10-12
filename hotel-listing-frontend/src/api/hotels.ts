import type { Hotel, HotelFormValues } from "../types";

// All hotel API calls. Reads are used with useQuery, changes with useMutation.
// Protected requests (add, edit, delete) send the JWT token in the Authorization header.

// The API takes multipart/form-data so images can be uploaded.
// Every file goes under the same "images" key.
function buildHotelFormData(data: HotelFormValues): FormData {
  const form = new FormData();
  form.append("name", data.name);
  form.append("city", data.city);
  form.append("address", data.address);
  form.append("price", String(data.price));
  form.append("rooms", String(data.rooms));
  form.append("description", data.description);

  // On Edit with no new files nothing is appended under "images",
  // so the server keeps the old images (an empty value would delete them all).
  if (data.images) {
    for (const file of Array.from(data.images)) {
      form.append("images", file);
    }
  }
  return form;
}

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
  const form = buildHotelFormData(data);
  form.append("userId", String(userId));

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels`, {
    method: "POST",
    // no Content-Type here: the browser sets it, including the multipart boundary
    headers: { Authorization: `Bearer ${token}` },
    body: form,
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

// PATCH /hotels/:id -> only the fields we send are changed; new images are appended
export const updateHotel = async (
  data: HotelFormValues,
  id: number,
  token: string,
): Promise<Hotel> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: buildHotelFormData(data),
  });
  if (!res.ok) throw new Error(`Failed to update hotel (status ${res.status})`);
  return res.json();
};
