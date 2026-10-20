import placeholder from "../../assets/hotel.jpg";
import type { Booking } from "../../types";
import { formatDay, getNights } from "../../utils/bookingDates";
import StatusBadge from "./StatusBadge";

interface TravelerBookingCardProps {
  booking: Booking;
  // only passed for pending bookings by the page
  onCancel?: () => void;
  isCancelling?: boolean;
}

// One booking row on the traveler's My Bookings page.
// It only shows data; the page decides what Cancel does.
export default function TravelerBookingCard({
  booking,
  onCancel,
  isCancelling = false,
}: TravelerBookingCardProps) {
  const {
    hotelName,
    hotelImage,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status,
  } = booking;

  // nights are calculated from the dates, so the server doesn't need to store them
  const nights = getNights(checkIn, checkOut);

  return (
    <section className="flex gap-4 rounded-3xl bg-black p-4 text-white shadow-md sm:p-5">
      <img
        src={hotelImage ?? placeholder}
        alt={hotelName}
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{hotelName}</p>
          <p className="text-sm text-neutral-300">
            {formatDay(checkIn)} to {formatDay(checkOut)}
          </p>
          <p className="text-sm text-neutral-300">
            {nights} night{nights !== 1 && "s"}
          </p>
          <p className="text-sm text-neutral-300">
            {guests} guest{guests !== 1 && "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">${totalPrice.toLocaleString()}</span>

          {/* ml-auto pushes this group to the right */}
          <div className="ml-auto flex items-center gap-2">
            {onCancel && (
              <button
                onClick={onCancel}
                disabled={isCancelling}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel request"}
              </button>
            )}
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
    </section>
  );
}
