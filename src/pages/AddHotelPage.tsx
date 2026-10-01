import { useMutation, useQueryClient } from "@tanstack/react-query";
import HotelForm from "../components/hotel/HotelForm";
import { useAuth } from "../context/AuthContext";
import { createHotel } from "../api/hotels";
import type { HotelFormValues } from "../types";
import { useNavigate } from "react-router-dom";

export default function AddHotelPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const hotelMutation = useMutation({
    mutationFn: (data: HotelFormValues) => createHotel(data, user!.id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels", "mine", user!.id] });
      navigate("/dashboard");
    },
  });

  return (
    <HotelForm
      onSubmit={hotelMutation.mutate}
      isPending={hotelMutation.isPending}
    />
  );
}
