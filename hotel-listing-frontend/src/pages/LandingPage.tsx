import { Navigate } from "react-router-dom";
import Hero from "../components/Hero";
import HotelGrid from "../components/hotel/HotelGrid";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/getHomePath";

// Home page ( / ): intro section on top, list of all hotels below.
// Logged-in users go to their own dashboard instead.
export default function LandingPage() {
  const { user } = useAuth();

  if (user) return <Navigate to={getHomePath(user.role)} replace />;

  return (
    <>
      <Hero />
      {/* the Hero button and the footer link scroll to this id.
          scroll-mt-20 leaves space so the sticky header doesn't cover the top. */}
      <div id="hotels" className="scroll-mt-20">
        <HotelGrid />
      </div>
    </>
  );
}
