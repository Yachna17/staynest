import type { BookingStatus } from "../../types";

interface StatusBadgeProps {
  status: BookingStatus;
}

// colours and label for each status tag
const STATUS: Record<BookingStatus, { label: string; style: string }> = {
  confirmed: {
    label: "Confirmed",
    style: "border-green-500/40 bg-green-500/10 text-green-400",
  },
  pending: {
    label: "Pending",
    style: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  },
  rejected: {
    label: "Rejected",
    style: "border-red-500/40 bg-red-500/10 text-red-400",
  },
  cancelled: {
    label: "Cancelled",
    style: "border-neutral-500/40 bg-neutral-500/10 text-neutral-400",
  },
};

// The coloured status tag, used on both booking cards.
export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-medium ${STATUS[status].style}`}
    >
      {STATUS[status].label}
    </span>
  );
}
