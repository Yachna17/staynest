import HotelCard from "./HotelCard.tsx";
import { getHotels } from "../../api/hotels.ts";
import { useQuery } from "@tanstack/react-query";

export default function HotelGrid() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No hotels yet</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
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
