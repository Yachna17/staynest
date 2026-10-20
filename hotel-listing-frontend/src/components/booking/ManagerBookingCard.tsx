import type { Booking } from "../../types";
import { formatDay, getNights } from "../../utils/bookingDates";
import StatusBadge from "./StatusBadge";

interface ManagerBookingCardProps {
  booking: Booking;
  // only passed for pending bookings by the page
  onConfirm?: () => void;
  onReject?: () => void;
  // true while a confirm or reject request is running
  isUpdating?: boolean;
}

// One booking request on the manager's Booking Requests page.
// It only shows data; the page decides what Confirm and Reject do.
export default function ManagerBookingCard({
  booking,
  onConfirm,
  onReject,
  isUpdating = false,
}: ManagerBookingCardProps) {
  const {
    name,
    email,
    contactInfo,
    hotelName,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status,
  } = booking;

  const nights = getNights(checkIn, checkOut);

  return (
    <section className="flex gap-4 rounded-3xl bg-black p-4 text-white shadow-md sm:p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{name}</p>
          <p className="truncate text-sm text-neutral-300">{email}</p>
          <p className="truncate text-sm text-neutral-300">{contactInfo}</p>
          <p className="text-sm text-neutral-300">{hotelName}</p>
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
            {onReject && (
              <button
                onClick={onReject}
                disabled={isUpdating}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            )}
            {onConfirm && (
              <button
                onClick={onConfirm}
                disabled={isUpdating}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
            )}
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
    </section>
  );
}
