import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/getHomePath";
import type { Role } from "../types";

interface ProtectedRoutesProps {
  // the only role that may open the pages inside this guard
  allowedRole: Role;
}

// Guard for private pages. Each guard belongs to one role.
// Logged out -> /login. Wrong role -> that user's own dashboard.
// Right role -> render the child route via <Outlet />.
export default function ProtectedRoutes({ allowedRole }: ProtectedRoutesProps) {
  const { user, justLoggedOut } = useAuth();

  // after an intentional logout go to the landing page, otherwise to /login
  if (!user)
    return <Navigate to={justLoggedOut.current ? "/" : "/login"} replace />;

  if (user.role !== allowedRole)
    return <Navigate to={getHomePath(user.role)} replace />;

  return <Outlet />;
}
