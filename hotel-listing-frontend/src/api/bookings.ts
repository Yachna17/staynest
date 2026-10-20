import type { Booking, BookingFormValues, BookingStatus } from "../types";

// All booking API calls. Every request sends the JWT token, and the token tells the
// server who is asking (a traveler or a manager).

// GET /bookings -> traveler: their own bookings, manager: bookings of their hotels
export const getBookings = async (token: string): Promise<Booking[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch bookings (status ${res.status})`);
  return res.json();
};

// POST /bookings -> traveler requests a stay, the server saves it as "pending".
// Only hotelId and the form fields are sent; the server fills in the rest.
export const createBooking = async (
  data: BookingFormValues,
  hotelId: number,
  token: string,
): Promise<Booking> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, hotelId }),
  });

  if (!res.ok) {
    // the API sends errors as { message: "..." }
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Booking failed (status ${res.status})`);
  }
  return res.json();
};

// PATCH /bookings/:id -> confirm, reject and cancel all send this request,
// only the status is different, so it is written once here
const updateBookingStatus = async (
  id: number,
  status: BookingStatus,
  token: string,
): Promise<Booking> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message ?? `Failed to update booking (status ${res.status})`,
    );
  }
  return res.json();
};

// manager confirms a pending request
export const confirmBooking = (id: number, token: string) =>
  updateBookingStatus(id, "confirmed", token);

// manager rejects a pending request
export const rejectBooking = (id: number, token: string) =>
  updateBookingStatus(id, "rejected", token);

// traveler cancels a pending request
export const cancelBooking = (id: number, token: string) =>
  updateBookingStatus(id, "cancelled", token);
