import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import type { User } from "../types";

// What every component can read from the context
interface AuthContextType {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
  // true after the user clicked Logout, so route guards can redirect to "/"
  justLoggedOut: RefObject<boolean>;
}

// undefined by default, so useAuth() can detect use outside the provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  // The function form of useState runs only once, on the first render.
  // It reads localStorage, which is why the user stays logged in after a refresh.
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const justLoggedOut = useRef(false);

  // Called after a successful login or register: save in state AND localStorage
  function login(user: User, token: string) {
    justLoggedOut.current = false;
    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }

  // Clear both state and localStorage
  function logout() {
    justLoggedOut.current = true;
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext value={{ user, token, login, logout, justLoggedOut }}>
      {children}
    </AuthContext>
  );
}

// Custom hook: const { user, token, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an Auth Provider");
  }

  return context;
}
