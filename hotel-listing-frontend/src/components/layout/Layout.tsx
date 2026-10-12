import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

// Shared page frame: Header on top, the current page in the middle, Footer at the bottom.
// min-h-dvh + flex-1 on <main> push the footer to the bottom even on short pages.
export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        {/* the matching child route renders here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
