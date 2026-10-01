import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { deleteHotel, getHotelsByUser } from "../api/hotels";
import { Link, useNavigate } from "react-router-dom";
import HotelCard from "../components/hotel/HotelCard";
import type { Hotel } from "../types";
import { useState } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteHotel(id, token!),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["hotels", "mine", userId] }),
  });

  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);

  const userId = user?.id ?? 0;

  const { data, error, isLoading } = useQuery({
    queryKey: ["hotels", "mine", userId],
    queryFn: () => getHotelsByUser(userId),
    enabled: !!user,
  });

  if (!user) return <div>Please log in to view your dashboard.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div> Error: {error.message} </div>;
  if (!data || data.length === 0)
    return (
      <div>
        {" "}
        No Hotels yet <Link to={"/dashboard/add"}>+ Add Hotel</Link>{" "}
      </div>
    );

  return (
    <div>
      <section className="grid grid-col-2 px-8">
        <h1>My Hotels</h1>
        <Link
          to="/dashboard/add"
          className="justify-self-end bg-black text-white rounded-full px-4 py-1"
        >
          + Add Hotel
        </Link>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
        {data.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotelName={hotel.name}
            city={hotel.city}
            price={hotel.price}
            image={hotel.image}
            onEdit={() => navigate(`/dashboard/edit/${hotel.id}`)}
            onDelete={() => setHotelToDelete(hotel)}
          ></HotelCard>
        ))}
      </div>
      <ConfirmDialog
        isOpen={hotelToDelete !== null}
        message={`Delete "${hotelToDelete?.name}"? This can't be undone.`}
        onCancel={() => setHotelToDelete(null)}
        onConfirm={() => {
          if (hotelToDelete) {
            deleteMutation.mutate(hotelToDelete.id, {
              onSuccess: () => setHotelToDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
