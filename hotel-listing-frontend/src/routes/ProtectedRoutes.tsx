import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guard for private pages (dashboard, add hotel, edit hotel).
// Logged out -> redirect to /login. Logged in -> render the child route via <Outlet />.
export default function ProtectedRoutes() {
  const { user, justLoggedOut } = useAuth();

  // after an intentional logout go to the landing page, otherwise to /login
  if (!user)
    return <Navigate to={justLoggedOut.current ? "/" : "/login"} replace />;

  return <Outlet />;
}
