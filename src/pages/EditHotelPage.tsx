import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelsById, updateHotel } from "../api/hotels";
import HotelForm from "../components/hotel/HotelForm";
import { useAuth } from "../context/AuthContext";
import type { HotelFormValues } from "../types";

// /dashboard/edit/:id - private page
export default function EditHotelPage() {
  // read :id from the URL (it is always a string, so convert it to a number)
  const { id } = useParams();
  const hotelId = Number(id);

  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // load the hotel so the form can be pre-filled; the id is part of the key
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", hotelId],
    queryFn: () => getHotelsById(hotelId),
  });

  const hotelMutation = useMutation({
    mutationFn: (formData: HotelFormValues) =>
      updateHotel(formData, hotelId, token!),
    onSuccess: () => {
      // refresh all hotel data (landing page, dashboard and this hotel)
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      navigate("/dashboard", {
        state: { message: "Hotel updated successfully" },
      });
    },
  });

  // guard states before showing the form
  if (!id || Number.isNaN(hotelId))
    return <div className="px-4 py-20 text-center text-neutral-500">Invalid hotel.</div>;
  if (isLoading)
    return <div className="px-4 py-20 text-center text-neutral-500">Loading...</div>;
  if (error)
    return (
      <div className="px-4 py-20 text-center text-red-600">
        Error: {error.message}
      </div>
    );
  if (!data)
    return <div className="px-4 py-20 text-center text-neutral-500">Hotel not found.</div>;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">Edit Hotel</h1>
        {/* defaultValues pre-fills the form with the existing hotel */}
        <HotelForm
          defaultValues={data}
          onSubmit={hotelMutation.mutate}
          isPending={hotelMutation.isPending}
        />
      </div>
    </div>
  );
}
