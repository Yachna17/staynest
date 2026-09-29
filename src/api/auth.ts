import type {
  LoginCredentials,
  AuthResponse,
  RegisterCredentials,
} from "../types";

export const loginRequest = async ({
  email,
  password,
}: LoginCredentials): Promise<AuthResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Login failed (status ${res.status})`);
  }
  return res.json();
};

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
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message ?? `Registeration failed (status ${res.status})`,
    );
  }
  return res.json();
};
