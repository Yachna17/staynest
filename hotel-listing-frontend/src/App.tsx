import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.tsx";
import AddHotelPage from "./pages/AddHotelPage.tsx";
import EditHotelPage from "./pages/EditHotelPage.tsx";
import BookingRequestsPage from "./pages/BookingRequestspage.tsx";
import RedirectIfAuthenticated from "./routes/RedirectIfAuthenticated.tsx";
import UserDashboardPage from "./pages/UserDashboardPage.tsx";
import BookHotelPage from "./pages/BookHotelPage.tsx";
import MyBookingsPage from "./pages/MyBookingsPage.tsx";

// One QueryClient for the whole app. It holds React Query's cache of API data.
const queryClient = new QueryClient();

function App() {
  return (
    // Providers wrap the app so every component can use React Query and the auth state
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            {/* Pages inside this route get the Header and Footer from Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />

              {/* Manager pages: ProtectedRoutes only lets managers in */}
              <Route element={<ProtectedRoutes allowedRole="manager" />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/add" element={<AddHotelPage />} />
                {/* :id is a URL parameter, read with useParams() in EditHotelPage */}
                <Route path="/dashboard/edit/:id" element={<EditHotelPage />} />
                <Route
                  path="/dashboard/bookings"
                  element={<BookingRequestsPage />}
                />
              </Route>

              {/* Traveler pages: ProtectedRoutes only lets travelers in */}
              <Route element={<ProtectedRoutes allowedRole="traveler" />}>
                <Route path="/user-dashboard" element={<UserDashboardPage />} />
                {/* :id is the hotel being booked, read with useParams() in BookHotelPage */}
                <Route
                  path="/user-dashboard/book/:id"
                  element={<BookHotelPage />}
                />
                <Route
                  path="/user-dashboard/my-bookings"
                  element={<MyBookingsPage />}
                />
              </Route>
            </Route>

            <Route element={<RedirectIfAuthenticated />}>
              {/* Login and Register are full-screen pages without Header/Footer */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
