import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart state with data from localStorage if it exists
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : []; // If there's a saved cart, use it, otherwise start with an empty array
  });

  // Update the cart in localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart to localStorage
    }
  }, [cart]); // This effect runs whenever the cart state changes

  const updateCartInLocalStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart)); // Function to update cart in localStorage
  };

  const addToCart = (item) => {
    console.log('Adding item:', item);  // Log item data
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      // Update quantity if item already exists
      const updatedCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart); // Update cart state
    } else {
      // Add new item to cart
      const updatedCart = [...cart, { ...item, quantity: 1 }];
      setCart(updatedCart); // Update cart state
    }
    console.log('Updated Cart:', cart);  // Log the cart after update
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart); // Update cart state
    updateCartInLocalStorage(newCart); // Also update the cart in localStorage
  };

  const updateQuantity = (id, quantity) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(newCart); // Update cart state
    updateCartInLocalStorage(newCart); // Also update the cart in localStorage
  };

  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;  // Ensure price is a valid number
      const itemQuantity = item.quantity || 0;  // Ensure quantity is a valid number
      console.log('Item:', item);  // Log the item
      console.log('Item Price:', itemPrice, 'Item Quantity:', itemQuantity);
      return total + itemPrice * itemQuantity;
    }, 0);
    console.log('Calculated Total:', total);  // Log the total
    return total.toFixed(2);  // Return formatted total
  };

  

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
