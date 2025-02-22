import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on app start
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart"));
        if (storedCart) setCart(storedCart);
    }, []);

    // Save cart to localStorage whenever it updates
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Function to add items to cart
    const addToCart = (item) => {
        setCart((prevCart) => {
          // Prevent adding multiple subscriptions
          if (item.type === "subscription") {
            if (prevCart.some((cartItem) => cartItem.type === "subscription")) {
              alert("You can only have one subscription at a time.");
              return prevCart;
            }
          }
      
          // If item already exists, increase quantity
          const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return prevCart.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
          }
      
          // Otherwise, add a new item to cart
          const updatedCart = [...prevCart, { ...item, quantity: 1 }];
          console.log("Updated Cart:", updatedCart);  // Log cart here
          return updatedCart;
        });
      };
      

    // Function to remove items from cart
    // Function to remove a specific item from the cart
    const removeFromCart = (id, index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const item = updatedCart.filter((cartItem) => cartItem.id === id);

        // Check if an item with the same id exists and remove the specific one
            if (item.length > 1) {
            // Only remove the item at the specific index
            updatedCart.splice(index, 1);
            } else {
            // If there's only one instance, just filter it out as before
            updatedCart.filter((cartItem) => cartItem.id !== id);
            }
            return updatedCart;
        });
};


    // Function to update item quantity
    const updateQuantity = (id, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
