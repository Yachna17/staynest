import { useForm } from "react-hook-form";
import type { HotelFormValues, Hotel } from "../../types";

interface HotelFormProps {
  // passed only on the Edit page, to pre-fill the form
  defaultValues?: Hotel;
  onSubmit: (data: HotelFormValues) => void;
  isPending: boolean;
}

// One form used for both Add and Edit.
// If defaultValues is given it behaves as the Edit form, otherwise as the Add form.
export default function HotelForm({
  defaultValues,
  onSubmit,
  isPending,
}: HotelFormProps) {
  const { register, handleSubmit, formState } = useForm<HotelFormValues>({
    // Only pick the fields that are in the form. If we passed the whole hotel,
    // extra fields (id, userId, ...) would also be sent to the API on submit.
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          city: defaultValues.city,
          address: defaultValues.address,
          price: defaultValues.price,
          rooms: defaultValues.rooms,
          image: defaultValues.image ?? "",
          description: defaultValues.description,
        }
      : {
          name: "",
          city: "",
          address: "",
          price: undefined,
          rooms: undefined,
          image: "",
          description: "",
        },
  });

  const { errors } = formState;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="hotel-name"
          className="text-sm font-medium text-neutral-700"
        >
          Hotel Name
        </label>
        <input
          id="hotel-name"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          {...register("name", {
            required: { value: true, message: "Hotel Name is required" },
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="text-sm font-medium text-neutral-700">
          City
        </label>
        <input
          id="city"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          {...register("city", {
            required: { value: true, message: "City is required" },
          })}
        />
        {errors.city && (
          <p className="text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="address"
          className="text-sm font-medium text-neutral-700"
        >
          Address
        </label>
        <textarea
          id="address"
          rows={4}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          {...register("address", {
            required: { value: true, message: "Address is required" },
          })}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* price and rooms sit side by side from sm up, stacked on mobile */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="price-per-night"
            className="text-sm font-medium text-neutral-700"
          >
            Price per night
          </label>
          <input
            id="price-per-night"
            type="number"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            {...register("price", {
              required: { value: true, message: "Price is required" },
              // inputs give strings; this converts the value to a number
              valueAsNumber: true,
            })}
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="number-of-rooms"
            className="text-sm font-medium text-neutral-700"
          >
            Number of rooms
          </label>
          <input
            id="number-of-rooms"
            type="number"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            {...register("rooms", {
              required: { value: true, message: "Number of rooms is required" },
              valueAsNumber: true,
            })}
          />
          {errors.rooms && (
            <p className="text-sm text-red-600">{errors.rooms.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="image-url"
          className="text-sm font-medium text-neutral-700"
        >
          Image URL
        </label>
        <input
          id="image-url"
          type="url"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          {...register("image", {
            required: { value: true, message: "Image is required" },
          })}
        />
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-neutral-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          {...register("description", {
            required: { value: true, message: "Description is required" },
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* disabled while saving; the text changes for Add vs Edit */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-black py-2.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : defaultValues ? "Save Changes" : "Add Hotel"}
      </button>
    </form>
  );
}
