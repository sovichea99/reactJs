import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';

// Create a Context for the Cart
export const CartContext = createContext();

// Create a Provider component
const CartProvider = ({ children }) => {
  // Initialize cartItems from localStorage or default to an empty array
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Sync cartItems with localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Function to add items to the cart
  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // Function to remove items from the cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  }, []);

  // Function to decrease quantity of a product
  const decreaseQuantity = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }, []);

  // Function to increase quantity of a product
  const increaseQuantity = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Function to clear the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate total item count for badge (memoized for performance)
  const itemCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        itemCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
