import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../Service/api";
import { getCurrentUser } from "../Service/Auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //REUSABLE FUNCTION TO LOAD THE USER'S SAVED CART ---
  //define this function so it can be used on initial page load AND after logging in.
  const loadUserCart = useCallback(async () => {
    setIsLoading(true); // Start loading
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        setCartItems([]); // No user, empty cart
        return;
      }

      const response = await api.get(`/cart/${user.id}`);
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCartItems([]); // Normal for new users
      } else {
        console.error("Failed to load cart:", error);
      }
    } finally {
      setIsLoading(false); // Finish loading
    }
  }, []);
  // This runs only ONCE when the CartProvider is first created.
  useEffect(() => {
    loadUserCart();
  }, [loadUserCart]); // It runs the function we defined above.

  //EFFECT TO SYNC CART TO THE BACKEND WHEN IT CHANGES ---
  // This runs whenever `cartItems` state is updated.
  useEffect(() => {
    if (isLoading) {
      return;
    }
    const user = getCurrentUser();
    if (!user || !user.id) return;

    // This debounce prevents sending too many API requests if the user clicks rapidly.
       const debounceSync = setTimeout(() => {
      
      // --- THIS IS THE CORRECTED LOGIC ---
      if (cartItems.length > 0) {
        // --- The "UPDATE" Case ---
        // If there are items in the cart, send a POST request to update/create the cart.
        console.log("Syncing: Cart has items. Updating on backend.");
        api.post(`/cart/${user.id}`, { items: cartItems })
          .then(() => console.log("Cart updated on backend successfully."))
          .catch((err) => console.error("Update sync failed:", err.response ? err.response.data : err.message));

      } else {
        // --- The "DELETE" Case ---
        api.delete(`/cart/${user.id}`)
          .then(() => console.log("Cart deleted from backend successfully."))
          .catch((err) => console.error("Delete sync failed:", err.response ? err.response.data : err.message));
      }
    }, 800); // Wait 800ms after the last change before syncing.

    return () => clearTimeout(debounceSync); // Cleanup the timeout on unmount or re-run
  }, [cartItems, isLoading]); // This effect runs whenever `cartItems` changes.

  // --- CART ACTION FUNCTIONS ---

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (i) => i.id === (product.id || product._id)
    );
    if (existingItem) {
      setCartItems(
        cartItems.map((i) =>
          i.id === existingItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      const newCartItem = {
        id: product.id || product._id,
        name: product.name || "Unnamed Product",
        price: parseFloat(product.price) || 0,
        quantity: 1,
        image_url: product.image_url || "",
      };
      setCartItems((prevItems) => [...prevItems, newCartItem]);
    }
  };

  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };  

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    console.log("Local cart state has been cleared.");
  };

  // --- DERIVED STATE (Calculated values) ---

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- PROVIDER'S VALUE ---
  // These are all the values and functions made available to the rest of the app.
  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        isLoading,
        loadUserCart, // Now correctly exposed
        clearCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// It's good practice to export the Provider as the default.
export default CartProvider;
