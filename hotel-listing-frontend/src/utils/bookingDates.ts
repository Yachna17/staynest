// Date helpers shared by the booking form and both booking cards.

// "2026-11-02" -> "2 Nov"
export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// number of nights between two dates (never below 0)
export const getNights = (checkIn: string, checkOut: string) =>
  Math.max(
    0,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000,
    ),
  );
