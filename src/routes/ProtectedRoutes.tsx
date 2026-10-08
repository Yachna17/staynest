import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guard for private pages (dashboard, add hotel, edit hotel).
// Logged out -> redirect to /login. Logged in -> render the child route via <Outlet />.
export default function ProtectedRoutes() {
  const { user } = useAuth();

  // "replace" swaps the history entry, so the Back button doesn't return to the blocked page
  if (!user) return <Navigate to={"/login"} replace />;

  return <Outlet />;
}
