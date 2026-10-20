import type { Role } from "../types";

// Where each role starts after login. Used by the login/register forms, the route
// guards, the Header and the Footer, so the paths are written in one place only.
export const getHomePath = (role: Role) =>
  role === "manager" ? "/dashboard" : "/user-dashboard";
