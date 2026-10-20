import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { cancelBooking, getBookings } from "../api/bookings";
import TravelerBookingCard from "../components/booking/TravelerBookingCard";

// /user-dashboard/my-bookings - private page: the traveler's own booking requests
export default function MyBookingsPage() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["bookings", "mine", user?.id],
    queryFn: () => getBookings(token!),
    enabled: !!token,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelBooking(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

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
  if (!data || data.length === 0)
    return (
      <div className="px-4 py-20 text-center text-neutral-600">
        No bookings yet
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Bookings</h1>
      <div className="flex flex-col gap-4">
        {data.map((booking) => (
          <TravelerBookingCard
            key={booking.id}
            booking={booking}
            // only a pending request can be cancelled
            onCancel={
              booking.status === "pending"
                ? () => cancelMutation.mutate(booking.id)
                : undefined
            }
            isCancelling={
              cancelMutation.isPending &&
              cancelMutation.variables === booking.id
            }
          />
        ))}
      </div>
    </div>
  );
}
