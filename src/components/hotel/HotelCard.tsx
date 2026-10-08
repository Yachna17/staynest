import { useState } from "react";
import placeholder from "../../assets/hotel.jpg";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface HotelCardProps {
  hotelName: string;
  city: string;
  address: string;
  price: number;
  rooms: number;
  description: string;
  images: string[];
  // optional: only the dashboard passes these, so the landing page shows no buttons
  onEdit?: (event: React.MouseEvent) => void;
  onDelete?: (event: React.MouseEvent) => void;
}

// One hotel card, used on the landing page and on the dashboard.
// It only shows data; the parent decides what edit and delete do.
export default function HotelCard({
  hotelName,
  city,
  address,
  price,
  rooms,
  description,
  images,
  onEdit,
  onDelete,
}: HotelCardProps) {
  const [expand, setExpand] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // always at least one picture: older hotels may have no images at all
  const list = images?.length ? images : [placeholder];
  const hasMany = list.length > 1;

  function handleClick() {
    setExpand(!expand);
  }

  // stopPropagation: the whole card toggles expand on click,
  // so the carousel controls must not trigger that
  function showPrevious(event: React.MouseEvent) {
    event.stopPropagation();
    setCurrentImageIndex((i) => (i - 1 + list.length) % list.length);
  }

  function showNext(event: React.MouseEvent) {
    event.stopPropagation();
    setCurrentImageIndex((i) => (i + 1) % list.length);
  }

  function showImage(event: React.MouseEvent, index: number) {
    event.stopPropagation();
    setCurrentImageIndex(index);
  }

  return (
    // the card lifts up slightly on hover
    <section
      onClick={handleClick}
      className="rounded-4xl bg-black p-4 text-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-5"
    >
      {/* relative: the arrows and dots are positioned inside this box */}
      <div className="relative">
        <img
          src={list[currentImageIndex] ?? list[0]}
          alt={hotelName}
          className="h-56 w-full rounded-3xl object-cover sm:h-64"
        />

        {/* arrows and dots only when there is more than one image */}
        {hasMany && (
          <>
            <button
              onClick={showPrevious}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {list.map((url, index) => (
                <button
                  key={url}
                  onClick={(event) => showImage(event, index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`h-2 w-2 rounded-full transition ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        {/* min-w-0 lets long names be cut with "..." instead of breaking the layout */}
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold">{hotelName}</p>
          <p className="truncate text-sm text-neutral-300">{city}</p>
          {expand && (
            <p className="truncate text-sm text-neutral-300">{address}</p>
          )}
          <p className="mt-1">
            <span className="font-semibold">${price}</span>
            <span className="text-sm text-neutral-300">/night</span>
          </p>
          {expand && (
            <>
              <p className="truncate text-sm text-neutral-300">
                Number of Rooms: {rooms}
              </p>
              <p className="break-words text-sm text-neutral-300">
                {description}
              </p>
            </>
          )}
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
