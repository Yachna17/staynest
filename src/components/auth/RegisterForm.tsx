import { Link, useNavigate } from "react-router-dom";
import type { RegisterCredentials } from "../../types";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm() {
  const { register, handleSubmit, formState, getValues } =
    useForm<RegisterCredentials>({
      defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

  const { errors } = formState;

  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="text-gray-500 mt-1 mb-6">Welcome to StayNest</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
              {...register("name", {
                required: { value: true, message: "Name is required" },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
              {...register("password", {
                required: { value: true, message: " Password is required" },
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: " Confirm Password is required",
                },
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

          {registerMutation.isError && (
            <p className="text-sm text-red-600">
              {registerMutation.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="mt-2 bg-black text-white rounded-full py-2 font-medium"
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have account?{" "}
          <Link to="/login" className="text-black font-medium">
            LogIn
          </Link>
        </p>
      </div>
    </div>
  );
}
