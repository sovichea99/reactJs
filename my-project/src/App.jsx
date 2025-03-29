import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartProvider from "./Contexts/CartContext"; // Context Provider for Cart State
import Navbars from "./Components/Navbar/Navbars"; // Navbar Component
import Homes from "./Components/Home/Homes"; // Home Component
import Products from "./Components/Product/Products"; // Products Listing Page
import ProductDetail from "./Components/Product/ProductDetail"; // Product Details Page
import AddToCart from "./Components/Navbar/AddToCart"; // Cart Page
import PaymentPage from "./Components/Navbar/PaymentPage"; // Payment Page
import AboutUs from "./Components/Navbar/AboutUs"; // About Us Page
import Dashboard from "./Components/Navbar/Dashboard"; // Dashboard Page

const App = () => {
  return (
    <CartProvider>
      {/* Wrap the app with CartProvider for global state */}
      <Router>
        <main className="overflow-x-hidden">
          {/* Navbar visible on all pages */}
          <Navbars />
          <Routes>
            {/* Define Routes for all pages */}
            <Route path="/" element={<Homes />} /> {/* Home Page */}
            <Route path="/products" element={<Products />} /> {/* Products Listing */}
            <Route path="/product/:id" element={<ProductDetail />} /> {/* Single Product Details */}
            <Route path="/cart" element={<AddToCart />} /> {/* Shopping Cart */}
            <Route path="/payment" element={<PaymentPage />} /> {/* Payment Page */}
            <Route path="/about" element={<AboutUs />} /> {/* About Us */}
            <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
};

export default App;
