
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

// Create context
export const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Check if a product is a subscription (IDs 1-4)
  const isSubscription = (productId) => { 
    return productId >= 1 && productId <= 4;
  };
  
  // Check if a subscription product is already in the cart
  const hasSubscriptionInCart = () => {
    return cart.some(item => isSubscription(item.id));
  };
  
  // Get the subscription in cart, if any
  const getSubscriptionInCart = () => {
    return cart.find(item => isSubscription(item.id));
  };
  
  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    console.log('Current cart:', cart); 
    // Check if product is a subscription
    const productIsSubscription = isSubscription(product.id);
    
    // If it's a subscription and we already have one in the cart
    if (productIsSubscription && hasSubscriptionInCart()) {
      // Show popup notification
      toast.warning(
        <div className="subscription-toast">
          <strong>A subscription is already in your cart!</strong>
          <p>Only 1 subscription per person please!</p>
    </div>, 
    {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    }
  );
  return false; // Return false to indicate the item wasn't added
}

// Improved price parsing
let price = 0;
if (typeof product.price === 'number') {
  price = product.price;
} else if (typeof product.price === 'string') {
  // Remove any non-numeric characters except decimal point
  price = parseFloat(product.price.replace(/[^\d.-]/g, '')) || 0;
}

// Make sure we have all the required fields
const itemToAdd = {
  id: product.id,
  title: product.title || product.name || product.service || 'Product',
  price: price, // Use the properly parsed price
  image: product.image || product.poster || product.img || '',
  quantity: product.quantity || 1,
  isSubscription: productIsSubscription
};
    
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === itemToAdd.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += itemToAdd.quantity;
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, itemToAdd];
      }
    });
    
    // Show success toast
    toast.success(`${itemToAdd.title} added to cart!`);
    return true; // Return true to indicate the item was added successfully
  };
  
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Context value with all the functions and properties
  const value = {
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartCount,
    hasSubscriptionInCart,
    getSubscriptionInCart,
    isSubscription,
    getTotalPrice,
    itemCount: cartCount // Added for compatibility with the useCart hook
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

