import placeholder from "../../assets/hotel.jpg";
import { Pencil, Trash2 } from "lucide-react";

interface HotelCardProps {
  hotelName: string;
  city: string;
  price: number;
  image: string | null;
  // optional: only the dashboard passes these, so the landing page shows no buttons
  onEdit?: () => void;
  onDelete?: () => void;
}

// One hotel card, used on the landing page and on the dashboard.
// It only shows data; the parent decides what edit and delete do.
export default function HotelCard({
  hotelName,
  city,
  price,
  image,
  onEdit,
  onDelete,
}: HotelCardProps) {
  return (
    // the card lifts up slightly on hover
    <section className="rounded-4xl bg-black p-4 text-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-5">
      {/* use the placeholder image when the hotel has no image */}
      <img
        src={image ?? placeholder}
        alt={hotelName}
        className="h-56 w-full rounded-3xl object-cover sm:h-64"
      />

      <div className="mt-5 flex items-end justify-between gap-3">
        {/* min-w-0 lets long names be cut with "..." instead of breaking the layout */}
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold">{hotelName}</p>
          <p className="truncate text-sm text-neutral-300">{city}</p>
          <p className="mt-1">
            <span className="font-semibold">${price}</span>
            <span className="text-sm text-neutral-300">/night</span>
          </p>
        </div>

        {/* edit/delete buttons only appear when the parent passes the handlers */}
        {(onEdit || onDelete) && (
          <div className="flex flex-col gap-2">
            <button
              onClick={onEdit}
              aria-label="Edit hotel"
              className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={onDelete}
              aria-label="Delete hotel"
              className="rounded-full bg-white/10 p-2 transition hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
