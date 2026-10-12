import { Link, useNavigate } from "react-router-dom";
import type { RegisterCredentials } from "../../types";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm() {
  // getValues lets us read another field's current value (used to compare the passwords)
  const { register, handleSubmit, formState, getValues } =
    useForm<RegisterCredentials>({
      defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

  const { errors } = formState;

  const { login } = useAuth();
  const navigate = useNavigate();

  // After a successful registration the API returns a token, so we log the user in directly
  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate("/dashboard");
    },
  });

  const onSubmit = (formData: RegisterCredentials) => {
    registerMutation.mutate(formData);
  };

  return (
    // Same layout as the login page: scrollable full-screen area, centered card
    <div className="fixed inset-0 overflow-y-auto bg-neutral-100">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="mb-6 mt-1 text-neutral-500">Welcome to StayNest</p>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-neutral-700"
              >
                Name
              </label>
              <input
                id="name"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-neutral-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Confirm Password is required",
                  },
                  // custom rule: return true if valid, or an error message if not
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* error from the API, for example "Email already exists" */}
            {registerMutation.isError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {registerMutation.error.message}
              </p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="mt-2 w-full rounded-full bg-black py-2.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-black hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
