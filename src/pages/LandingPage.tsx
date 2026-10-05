import Hero from "../components/Hero";
import HotelGrid from "../components/hotel/HotelGrid";

// Home page ( / ): intro section on top, list of all hotels below
export default function LandingPage() {
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