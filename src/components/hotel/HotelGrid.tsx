import HotelCard from "./HotelCard.tsx";
import { getHotels } from "../../api/hotels.ts";
import { useQuery } from "@tanstack/react-query";

// Landing page list: fetches all hotels and shows them as cards.
export default function HotelGrid() {
  // useQuery is for reading data. The queryKey names this data in React Query's cache.
  // It gives us data, error and isLoading, so we don't need our own useState/useEffect.
  const { data, error, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
  });

  // loading, error and empty states
  if (isLoading)
    return <div className="px-4 py-10 text-center text-neutral-500">Loading...</div>;
  if (error)
    return (
      <div className="px-4 py-10 text-center text-red-600">
        Error: {error.message}
      </div>
    );
  if (!data || data.length === 0)
    return <div className="px-4 py-10 text-center text-neutral-500">No hotels yet</div>;

  // 1 column on mobile, 2 on tablet (sm), 3 on desktop (lg)
  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
      {data.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotelName={hotel.name}
          city={hotel.city}
          price={hotel.price}
          image={hotel.image}
        ></HotelCard>
      ))}
    </div>
  );
}
