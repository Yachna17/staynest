import type { Hotel } from "../types"

export const getHotels = async (): Promise<Hotel[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotels`)
  if (!res.ok) throw new Error(`Failed to fetch hotels (status ${res.status})`)
  return res.json()
}