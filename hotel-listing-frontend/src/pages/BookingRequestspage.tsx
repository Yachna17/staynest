import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { confirmBooking, getBookings, rejectBooking } from "../api/bookings";
import ManagerBookingCard from "../components/booking/ManagerBookingCard";

// /dashboard/bookings - private page: booking requests for the manager's hotels
export default function BookingRequestsPage() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  // one key, used by the query and by both mutations below
  const bookingsKey = ["bookings", "manager", user?.id];

  const { data, error, isLoading } = useQuery({
    queryKey: bookingsKey,
    queryFn: () => getBookings(token!),
    enabled: !!token,
  });

  // after a confirm or reject, refetch the list so the new status shows
  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectBooking(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKey }),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) => confirmBooking(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKey }),
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
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Booking Requests</h1>
      <div className="flex flex-col gap-4">
        {data.map((booking) => (
          <ManagerBookingCard
            key={booking.id}
            booking={booking}
            // only a pending request can be confirmed or rejected
            onConfirm={
              booking.status === "pending"
                ? () => confirmMutation.mutate(booking.id)
                : undefined
            }
            onReject={
              booking.status === "pending"
                ? () => rejectMutation.mutate(booking.id)
                : undefined
            }
            isUpdating={confirmMutation.isPending || rejectMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
