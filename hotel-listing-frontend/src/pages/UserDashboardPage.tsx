import { Link } from "react-router-dom";
import HotelGrid from "../components/hotel/HotelGrid";

// /user-dashboard - private page for travelers: all hotels, and a link to their bookings
export default function UserDashboardPage() {
  return (
    <div className="pb-6">
      <section className="flex flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Find your next stay</h1>
        <Link
          to="/user-dashboard/my-bookings"
          className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800"
        >
          My Bookings
        </Link>
      </section>
      <HotelGrid />
    </div>
  );
}
