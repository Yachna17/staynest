import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginCredentials } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../../api/auth";

export default function LoginForm() {
  // React Hook Form: register() connects an input to the form,
  // handleSubmit() runs the validation first, formState holds the errors.
  const { register, handleSubmit, formState } = useForm<LoginCredentials>({
    defaultValues: { email: "", password: "" },
  });

  const { errors } = formState;

  const { login } = useAuth();
  const navigate = useNavigate();

  // useMutation is for requests that change data (login, register, add, edit, delete).
  // onSuccess runs only when the request succeeds.
  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      // save the user + token in the context / localStorage, then open the dashboard
      login(data.user, data.accessToken);
      navigate("/dashboard");
    },
  });

  // only called when all validation rules pass
  const onSubmit = (formData: LoginCredentials) => {
    loginMutation.mutate(formData);
  };

  return (
    // The outer div covers the screen and can scroll on short phones.
    // The inner div centers the card.
    <div className="fixed inset-0 overflow-y-auto bg-neutral-100">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <h1 className="text-2xl font-bold">Log in</h1>
          <p className="mb-6 mt-1 text-neutral-500">Welcome back to StayNest</p>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* error message from the API, for example "Incorrect email or password" */}
            {loginMutation.isError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {loginMutation.error.message}
              </p>
            )}

            {/* disabled while the request is running, so it can't be clicked twice */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-2 w-full rounded-full bg-black py-2.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            No account?{" "}
            <Link
              to="/register"
              className="font-medium text-black hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
