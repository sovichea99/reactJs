import React from "react";
import { BrowserRouter as Router, Routes, Route,useLocation, Outlet } from "react-router-dom";
import CartProvider from "./Contexts/CartContext"; // Context Provider for Cart State
import Navbars from "./Components/Navbar/Navbars"; // Navbar Component
import Homes from "./Components/Home/Homes"; // Home Component
import Products from "./Components/Product/Products"; // Products Listing Page
import ProductDetail from "./Components/Product/ProductDetail"; // Product Details Page
import AddToCart from "./Components/Navbar/AddToCart"; // Cart Page
import PaymentPage from "./Components/Navbar/PaymentPage"; // Payment Page
import AboutUs from "./Components/Navbar/AboutUs"; // About Us Page
import Dashboard from "./Components/Navbar/Dashboard"; // Dashboard Page
import Login from "./Components/Auth/login"; // Login Page
import Register from "./Components/Auth/register";

const Layout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"];


  return (
    <div className="overflow-x-hidden">
      {!hideNavbar.includes(location.pathname) && <Navbars />}
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      {/* Wrap the app with CartProvider for global state */}
      <Router>
          <Routes>
            <Route element={<Layout />}> {/* Layout for all pages */}
              {/* Define Routes for all pages */}
              <Route path="/" element={<Homes />} /> {/* Home Page */}
              <Route path="/products" element={<Products />} />{" "}
              {/* Products Listing */}
              <Route path="/product/:id" element={<ProductDetail />} />{" "}
              {/* Single Product Details */}
              <Route path="/cart" element={<AddToCart />} /> {/* Shopping Cart */}
              <Route path="/payment" element={<PaymentPage />} />{" "}
              {/* Payment Page */}
              <Route path="/about" element={<AboutUs />} /> {/* About Us */}
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              {/* Dashboard */}
            </Route>
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
