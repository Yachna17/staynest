import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelsById, updateHotel } from "../api/hotels";
import HotelForm from "../components/hotel/HotelForm";
import { useAuth } from "../context/AuthContext";
import type { HotelFormValues } from "../types";

export default function EditHotelPage() {
  const { id } = useParams();
  const hotelId = Number(id);

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", hotelId],
    queryFn: () => getHotelsById(hotelId),
  });

  const hotelMutation = useMutation({
    mutationFn: (formData: HotelFormValues) =>
      updateHotel(formData, hotelId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels", "mine", user!.id] });
      queryClient.invalidateQueries({ queryKey: ["hotels", hotelId] });
      navigate("/dashboard");
    },
  });

  if (!id || Number.isNaN(hotelId)) return <div>Invalid hotel.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Hotel not found.</div>;

  return (
    <HotelForm
      defaultValues={data}
      onSubmit={hotelMutation.mutate}
      isPending={hotelMutation.isPending}
    />
  );
}
