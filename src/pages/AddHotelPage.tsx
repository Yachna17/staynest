import { useMutation, useQueryClient } from "@tanstack/react-query";
import HotelForm from "../components/hotel/HotelForm";
import { useAuth } from "../context/AuthContext";
import { createHotel } from "../api/hotels";
import type { HotelFormValues } from "../types";
import { useNavigate } from "react-router-dom";

// /dashboard/add - private page (protected in App.tsx)
export default function AddHotelPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const hotelMutation = useMutation({
    // the "!" tells TypeScript user and token are not null here (the route is protected)
    mutationFn: (data: HotelFormValues) => createHotel(data, user!.id, token!),
    onSuccess: () => {
      // mark every query starting with "hotels" as stale, so the landing page
      // and the dashboard load fresh data including the new hotel
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      // go to the dashboard and pass a message for it to show
      navigate("/dashboard", {
        state: { message: "Hotel added successfully" },
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">Add Hotel</h1>
        <HotelForm
          onSubmit={hotelMutation.mutate}
          isPending={hotelMutation.isPending}
        />
      </div>
    </div>
  );
}
