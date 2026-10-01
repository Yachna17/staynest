import placeholder from "../../assets/hotel.jpg";
import { Pencil, Trash2 } from "lucide-react";

interface HotelCardProps {
  hotelName: string;
  city: string;
  price: number;
  image: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function HotelCard({
  hotelName,
  city,
  price,
  image,
  onEdit,
  onDelete,
}: HotelCardProps) {
  return (
    <section className="rounded-4xl p-5 bg-black text-white">
      <img
        src={image ?? placeholder}
        alt="hotel-image"
        className="h-64 w-full object-cover rounded-4xl"
      />

      <div className="flex justify-between items-end mt-5">
        <div>
          <p className="font-semibold text-xl">{hotelName}</p>
          <p className="text-sm">{city}</p>
          <p>
            <span className="font-semibold">${price}</span>/night
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex flex-col gap-2">
            <button onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </button>

            <button onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
