
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import RegisterPage from "./pages/Registerpage.tsx"

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>} >
          <Route path="/" element={<LandingPage/>}  />
        </Route>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
