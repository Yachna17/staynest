import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginCredentials } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../../api/auth";

export default function LoginForm() {
  const { register, handleSubmit, formState } = useForm<LoginCredentials>({
    defaultValues: { email: "", password: "" },
  });

  const { errors } = formState;

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate("/dashboard");
    },
  });

  const onSubmit = (formData: LoginCredentials) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="text-gray-500 mt-1 mb-6">Welcome back to StayNest</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              {...register("password", {
                required: { value: true, message: " Password is required" },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {loginMutation.isError && (
            <p className="text-sm text-red-600">
              {loginMutation.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 bg-black text-white rounded-full py-2 font-medium disabled:opacity-50"
          >
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{" "}
          <Link to="/register" className="text-black font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
