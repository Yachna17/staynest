import { Link } from "react-router-dom";
import logo from "../../assets/StayNestLogo.png";
import { useAuth } from "../../context/AuthContext";

// Footer: logo, copyright and a few links.
// Mobile: one column, centered. From sm up: three columns (left, center, right).
export default function Footer() {
  // the links change depending on whether the user is logged in
  const { user } = useAuth();

  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white">
      <div className="grid grid-cols-1 items-center gap-4 px-4 py-8 text-center sm:grid-cols-3 sm:px-10">
        <img
          src={logo}
          alt="StayNestLogo"
          className="h-14 w-14 object-contain"
        />

        <p className="text-sm text-neutral-500 sm:justify-self-center">
          &copy; 2026 All rights reserved
        </p>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium sm:justify-self-end">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/dashboard/add" className="hover:underline">
                Add Hotel
              </Link>
            </>
          ) : (
            <>
              {/* a normal <a> is used because the link has to work from other pages too:
              it goes to the home page and then scrolls to #hotels */}
              <a href="/#hotels" className="hover:underline">
                Browse Hotels
              </a>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
