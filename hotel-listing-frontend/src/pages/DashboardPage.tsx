import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { deleteHotel, getHotelsByUser } from "../api/hotels";
import { Link, useNavigate, useLocation } from "react-router-dom";
import HotelCard from "../components/hotel/HotelCard";
import type { Hotel } from "../types";

import ConfirmDialog from "../components/ui/ConfirmDialog";

// /dashboard - private page for managers: shows only the hotels of the logged-in user
export default function DashboardPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const userId = user?.id ?? 0;

  // delete request; after it succeeds, refetch the list and show a message
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteHotel(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels", "mine", userId] });
      setErrorMessage(null);
      setMessage("Hotel deleted successfully");
    },
    onError: (error) => {
      setMessage(null);
      setErrorMessage(error.message);
    },
  });

  // the hotel waiting for delete confirmation (null = dialog closed)
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);

  // fetch only this user's hotels; "enabled" waits until the user exists
  const { data, error, isLoading } = useQuery({
    queryKey: ["hotels", "mine", userId],
    queryFn: () => getHotelsByUser(userId),
    enabled: !!user,
  });

  // The Add / Edit pages send a success message through the router state.
  // Read it here and keep it in state so it can be dismissed.
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(
    location.state?.message ?? null,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(
    location.state?.error ?? null,
  );

  // clear the router state so the message doesn't come back after a refresh
  useEffect(() => {
    if (location.state?.message || location.state?.error) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  // success and error banners, shared by the empty state and the normal view
  const banners = (
    <>
      {message && (
        <div className="mx-4 mb-4 mt-4 flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-green-800 sm:mx-10">
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            aria-label="Close message"
            className="text-xl leading-none"
          >
            x
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mx-4 mb-4 mt-4 flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-800 sm:mx-10">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            aria-label="Close error message"
            className="text-xl leading-none"
          >
            x
          </button>
        </div>
      )}
    </>
  );

  // loading, error and empty states
  if (!user)
    return (
      <div className="px-4 py-20 text-center">
        Please log in to view your dashboard.
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
  if (!data || data.length === 0)
    return (
      <>
        {banners}
        <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
          <p className="text-neutral-600">No Hotels yet</p>
          <Link
            to={"/dashboard/add"}
            className="rounded-full bg-black px-5 py-2 text-white transition hover:bg-neutral-800"
          >
            + Add Hotel
          </Link>
        </div>
      </>
    );

  return (
    <div className="pb-6">
      {/* success message (added / updated / deleted) with a close button */}
      {banners}

      {/* page title on the left, Bookings and Add Hotel buttons together on the right */}
      <section className="flex flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-10">
        <h1 className="text-2xl font-bold sm:text-3xl">My Hotels</h1>
        <div className="flex gap-3">
          <Link
            to="/dashboard/bookings"
            className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800"
          >
            Bookings
          </Link>
          <Link
            to="/dashboard/add"
            className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800"
          >
            + Add Hotel
          </Link>
        </div>
      </section>

      {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
        {data.map((hotel) => (
          // no bookTo here, so managers don't see the Book Now button
          <HotelCard
            key={hotel.id}
            hotelName={hotel.name}
            city={hotel.city}
            address={hotel.address}
            price={hotel.price}
            rooms={hotel.rooms}
            description={hotel.description}
            images={hotel.images}
            onEdit={(event) => {
              event.stopPropagation();
              navigate(`/dashboard/edit/${hotel.id}`);
            }}
            onDelete={(event) => {
              event.stopPropagation();
              setHotelToDelete(hotel);
            }}
          />
        ))}
      </div>

      {/* delete asks for confirmation first; the request only runs on "Delete" */}
      <ConfirmDialog
        isOpen={hotelToDelete !== null}
        message={`Delete "${hotelToDelete?.name}"? This can't be undone.`}
        isPending={deleteMutation.isPending}
        onCancel={() => setHotelToDelete(null)}
        onConfirm={() => {
          if (hotelToDelete) {
            deleteMutation.mutate(hotelToDelete.id, {
              onSettled: () => setHotelToDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
