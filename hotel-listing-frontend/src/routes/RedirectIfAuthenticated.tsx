import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/getHomePath";

// Guard for /login and /register: a logged-in user goes to their own dashboard instead.
export default function RedirectIfAuthenticated() {
  const { user } = useAuth();

  if (user) return <Navigate to={getHomePath(user.role)} replace />;

  return <Outlet />;
}
