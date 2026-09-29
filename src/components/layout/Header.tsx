import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/StayNestLogo.png";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="flex items-center gap-3 px-10">
      <Link to="/">
        <img src={logo} alt="StayNestLogo" className="h-20 w-20 "></img>
      </Link>
      <span className="grow"></span>

      {user ? (
        <>
          <Link to="/dashboard" className="px-2 py-1">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="border border-black px-2 py-1 rounded-full bg-black text-white"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className=" border  border-black px-2 py-1 rounded-full"
          >
            Login
          </Link>
          <Link
            to="/register"
            className=" border  border-black px-2 py-1 rounded-full bg-black text-white "
          >
            Register
          </Link>
        </>
      )}
    </header>
  );
}
