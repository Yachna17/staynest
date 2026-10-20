import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getHotelById } from "../api/hotels";
import BookingForm from "../components/booking/BookingForm";

// /user-dashboard/book/:id - private page for travelers: details of one hotel and the booking form
export default function BookHotelPage() {
  // read :id from the URL (it is always a string, so convert it to a number)
  const { id } = useParams();
  const hotelId = Number(id);

  // same key as the Edit page, so a hotel that is already loaded is reused from the cache
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", hotelId],
    queryFn: () => getHotelById(hotelId),
  });

  // guard states before showing the form
  if (!id || Number.isNaN(hotelId))
    return (
      <div className="px-4 py-20 text-center text-neutral-500">
        Invalid hotel.
      </div>
    );
  if (isLoading)
    return (
      <div className="px-4 py-20 text-center text-neutral-500">Loading...</div>
    );
  if (error)
    return (
      <div className="px-4 py-20 text-center text-red-600">
        Error: {error.message}
      </div>
    );
  if (!data)
    return (
      <div className="px-4 py-20 text-center text-neutral-500">
        Hotel not found.
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <BookingForm hotel={data} />
      </div>
    </div>
  );
}
