import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import AddHotelPage from "./pages/AddHotelPage.tsx";
import EditHotelPage from "./pages/EditHotelPage.tsx";

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

              {/* Private pages: ProtectedRoutes redirects to /login if not logged in */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/add" element={<AddHotelPage />} />
                {/* :id is a URL parameter, read with useParams() in EditHotelPage */}
                <Route path="/dashboard/edit/:id" element={<EditHotelPage />} />
              </Route>
            </Route>

            {/* Login and Register are full-screen pages without Header/Footer */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
