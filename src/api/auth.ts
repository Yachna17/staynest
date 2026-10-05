import type {
  LoginCredentials,
  AuthResponse,
  RegisterCredentials,
} from "../types";

// These are plain fetch functions. React Query's useMutation calls them from the forms.
// If the server answers with an error, we throw, so React Query puts it in mutation.error.

// POST /login -> returns { accessToken, user }
export const loginRequest = async ({
  email,
  password,
}: LoginCredentials): Promise<AuthResponse> => {
  // the API base URL comes from the .env file (VITE_API_BASE_URL)
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // fetch does not throw on 400/401, so we check res.ok ourselves
  if (!res.ok) {
    // the API sends errors as { message: "..." }
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Login failed (status ${res.status})`);
  }
  return res.json();
};

// POST /register -> creates the user and returns a token right away
export const registerRequest = async ({
  name,
  email,
  password,
}: RegisterCredentials): Promise<AuthResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // confirmPassword is not sent, the API does not need it
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message ?? `Registration failed (status ${res.status})`,
    );
  }
  return res.json();
};
