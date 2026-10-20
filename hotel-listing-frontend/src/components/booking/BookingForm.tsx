import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import placeholder from "../../assets/hotel.jpg";
import { createBooking } from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";
import { getNights } from "../../utils/bookingDates";
import type { BookingFormValues, Hotel } from "../../types";

interface BookingFormProps {
  // the hotel being booked (the page loads it from the URL)
  hotel: Hotel;
}

// Hotel details on top, booking form below. The page around it gives the white card.
export default function BookingForm({ hotel }: BookingFormProps) {
  // watch() re-renders the form when a value changes, so the total updates while typing
  const { register, handleSubmit, formState, watch } =
    useForm<BookingFormValues>({
      defaultValues: {
        contactInfo: "",
        checkIn: "",
        checkOut: "",
        guests: undefined,
      },
    });

  const { errors } = formState;

  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: (formData: BookingFormValues) =>
      createBooking(formData, hotel.id, token!),
    onSuccess: () => {
      // refresh the bookings list, then show it to the traveler
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate("/user-dashboard/my-bookings");
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  // nothing to calculate until both dates are picked
  const nights = checkIn && checkOut ? getNights(checkIn, checkOut) : 0;

  return (
    <>
      <div className="mb-6 flex flex-col gap-1">
        <img
          src={hotel.image ?? placeholder}
          alt={hotel.name}
          className="mb-3 h-56 w-full rounded-xl object-cover sm:h-64"
        />
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <p className="text-neutral-500">{hotel.city}</p>
        <p className="break-words text-neutral-700">{hotel.description}</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Book this stay</h2>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((formData) => bookingMutation.mutate(formData))}
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="contactInfo"
            className="text-sm font-medium text-neutral-700"
          >
            Contact info
          </label>
          <input
            id="contactInfo"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            {...register("contactInfo", {
              required: { value: true, message: "Contact info is required" },
            })}
          />
          {errors.contactInfo && (
            <p className="text-sm text-red-600">{errors.contactInfo.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="checkIn"
            className="text-sm font-medium text-neutral-700"
          >
            Check-in
          </label>
          <input
            id="checkIn"
            type="date"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            {...register("checkIn", {
              required: { value: true, message: "Check-in date is required" },
            })}
          />
          {errors.checkIn && (
            <p className="text-sm text-red-600">{errors.checkIn.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="checkOut"
            className="text-sm font-medium text-neutral-700"
          >
            Check-out
          </label>
          <input
            id="checkOut"
            type="date"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            {...register("checkOut", {
              required: { value: true, message: "Check-out date is required" },
            })}
          />
          {errors.checkOut && (
            <p className="text-sm text-red-600">{errors.checkOut.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="guests"
            className="text-sm font-medium text-neutral-700"
          >
            Guests
          </label>
          <input
            id="guests"
            type="number"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            {...register("guests", {
              required: { value: true, message: "Guests is required" },
              // inputs give strings; this converts the value to a number
              valueAsNumber: true,
            })}
          />
          {errors.guests && (
            <p className="text-sm text-red-600">{errors.guests.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm text-neutral-700">
          <p>Price per night: ${hotel.price}</p>
          <p className="font-semibold">
            Total price: ${nights * hotel.price} ({nights} night
            {nights !== 1 && "s"})
          </p>
        </div>

        {/* error from the API, for example "No rooms available for these dates" */}
        {bookingMutation.isError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {bookingMutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={bookingMutation.isPending}
          className="mt-2 w-full rounded-full bg-black py-2.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bookingMutation.isPending ? "Booking..." : "Request booking"}
        </button>
      </form>
    </>
  );
}
