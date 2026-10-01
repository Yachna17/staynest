import { useForm } from "react-hook-form";
import type { HotelFormValues, Hotel } from "../../types";

interface HotelFormProps {
  defaultValues?: Hotel;
  onSubmit: (data: HotelFormValues) => void;
  isPending: boolean;
}

export default function HotelForm({
  defaultValues,
  onSubmit,
  isPending,
}: HotelFormProps) {
  const { register, handleSubmit, formState } = useForm<HotelFormValues>({
    defaultValues: defaultValues ?? {
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
        <label htmlFor="hotel-name" className="text-sm font-medium">
          Hotel Name
        </label>
        <input
          id="hotel-name"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("name", {
            required: { value: true, message: "Hotel Name is required" },
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="text-sm font-medium">
          City
        </label>
        <input
          id="city"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("city", {
            required: { value: true, message: "City is required" },
          })}
        />
        {errors.city && (
          <p className="text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <textarea
          id="address"
          rows={4}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("address", {
            required: { value: true, message: "Address is required" },
          })}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="price-per-night" className="text-sm font-medium">
          Price per night
        </label>
        <input
          id="price-per-night"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("price", {
            required: { value: true, message: "Price is required" },
            valueAsNumber: true,
          })}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="number-of-rooms" className="text-sm font-medium">
          Number of rooms
        </label>
        <input
          id="number-of-rooms"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("rooms", {
            required: { value: true, message: "Number of rooms is required" },
            valueAsNumber: true,
          })}
        />
        {errors.rooms && (
          <p className="text-sm text-red-600">{errors.rooms.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="image-url" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="image-url"
          type="url"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("image", {
            required: { value: true, message: "Image is required" },
          })}
        />
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
          {...register("description", {
            required: { value: true, message: "Description is required" },
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 bg-black text-white rounded-full py-2 font-medium"
      >
        {isPending ? "Saving..." : defaultValues ? "Save Changes" : "Add Hotel"}
      </button>
    </form>
  );
}
