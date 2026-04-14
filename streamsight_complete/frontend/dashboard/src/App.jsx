import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components & Context
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import EcommerceSimulator from "./pages/EcommerceSimulator";
import UserActivity from "./pages/UserActivity";
import PaymentPage from "./pages/PaymentPage"; // Ensure path is correct
import { useSocket } from "./hooks/useSocket";
import { CartProvider } from "./context/CartContext";
import FlashSales from "./pages/FlashSales";
import Orders from "./pages/Orders";

const ROLE_ACCESS = {
  admin: ["/", "/analytics", "/user-activity"],
  analyst: ["/", "/analytics"],
  viewer: ["/", "/analytics"],
  customer: ["/ecommerce", "/flash-sales", "/orders", "/payment"],
};

function PrivateRoute() {
  const isAuth = localStorage.getItem("ss_auth") === "true";
  const role = (localStorage.getItem("ss_role") || "viewer").toLowerCase();
  const location = useLocation();

  if (!isAuth) return <Navigate to="/login" replace />;

  const allowed = ROLE_ACCESS[role] || [];

  // Redirect to their default landing page if they hit "/"
  if (location.pathname === "/") {
    if (role === "customer") return <Navigate to="/ecommerce" replace />;
  }

  // Check permissions: Redirect to home if path isn't allowed for their role
  if (!allowed.includes(location.pathname) && location.pathname !== "/") {
    return <Navigate to={role === "customer" ? "/ecommerce" : "/"} replace />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#07090f" }}>
      {/* Navbar is now visible to EVERYONE inside PrivateRoute */}
      <Navbar />
      <Box component="main" sx={{ flex: 1, p: 3, overflow: "auto" }}>
        <Routes>
          {/* Staff Specific Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/user-activity" element={<UserActivity />} />

          {/* Customer Specific Routes */}
          <Route path="/ecommerce" element={<EcommerceSimulator />} />
          <Route path="/flash-sales" element={<FlashSales tab="flash" />} />
          <Route path="/orders" element={<Orders tab="orders" />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <Navigate to={role === "customer" ? "/ecommerce" : "/"} replace />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  const theme = createTheme({ palette: { mode: "dark" } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<PrivateRoute />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}
