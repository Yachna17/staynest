
export default function HotelForm() {
  return (
    
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            <label htmlFor="hotel-name" className="text-sm font-medium">Hotel Name</label>
            <input
              id="hotel-name"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="city" className="text-sm font-medium">City</label>
            <input
              id="city"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <textarea
              id="address"
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="price-per-night" className="text-sm font-medium">Price per night</label>
            <input
              id="price-per-night"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="number-of-rooms" className="text-sm font-medium">Number of rooms</label>
            <input
              id="number-of-rooms"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

            <div className="flex flex-col gap-1">
            <label htmlFor="image-url" className="text-sm font-medium">Image URL</label>
            <input
              id="image-url"
              type="file"
              accept="image/*"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

            <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-black text-white rounded-full py-2 font-medium"
          >
            Submit
          </button>
        </form>
  );
}