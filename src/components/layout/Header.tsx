import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/StayNestLogo.png";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // is the mobile menu open?
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  // The links change with the login state. They are written once here and used
  // twice below: in the desktop nav and in the mobile menu.
  const links = user ? (
    <>
      <Link
        to="/dashboard"
        onClick={() => setOpen(false)}
        className="rounded-full px-4 py-1.5 text-center transition hover:bg-neutral-100"
      >
        Dashboard
      </Link>
      <Link
        to="/dashboard/add"
        onClick={() => setOpen(false)}
        className="rounded-full border border-black px-4 py-1.5 text-center transition hover:bg-black hover:text-white"
      >
        Add Hotel
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-full border border-black bg-black px-4 py-1.5 text-center text-white transition hover:bg-neutral-800"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={() => setOpen(false)}
        className="rounded-full border border-black px-4 py-1.5 text-center transition hover:bg-black hover:text-white"
      >
        Login
      </Link>
      <Link
        to="/register"
        onClick={() => setOpen(false)}
        className="rounded-full border border-black bg-black px-4 py-1.5 text-center text-white transition hover:bg-neutral-800"
      >
        Register
      </Link>
    </>
  );

  return (
    // sticky: the header stays at the top while scrolling
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-10">
      <div className="flex items-center gap-3">
        <Link to="/" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="StayNestLogo"
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
        </Link>
        {/* grow pushes everything after it to the right */}
        <span className="grow"></span>

        {/* desktop links: hidden on small screens, shown from md (768px) up */}
        <nav className="hidden items-center gap-3 md:flex">{links}</nav>

        {/* hamburger button: only visible on small screens */}
        <button
          className="rounded-lg p-2 transition hover:bg-neutral-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* mobile menu: opens below the header, full-width buttons */}
      {open && (
        <nav className="flex flex-col gap-2 pb-4 md:hidden">{links}</nav>
      )}
    </header>
  );
}
