import { Link } from "react-router-dom";

export default function RegisterForm() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-black p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="text-gray-500 mt-1 mb-6">Welcome to StayNest</p>

        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 "
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-black text-white rounded-full py-2 font-medium"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have account? <Link to="/login" className="text-black font-medium">LogIn</Link>
        </p>
      </div>
    </div>
  );
}