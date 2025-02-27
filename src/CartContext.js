import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';

export const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getItemCount: () => 0,
  isItemInCart: () => false,
});

export const CartProvider = ({ children, maxCartItems = 99, persistKey = "cart" }) => {
  // Initialize cart state with error handling
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(persistKey);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Persist cart data with error handling
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem(persistKey, JSON.stringify(cart));
      } else {
        localStorage.removeItem(persistKey);
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, persistKey]);

  // Enhanced addToCart with validation and limits
  const addToCart = useCallback((item) => {
    setCart((prevCart) => {
      try {
        // Validate item data
        if (!item.id || !item.type || !item.name || !item.price) {
          throw new Error("Invalid item data");
        }

        // Check cart limits
        if (prevCart.length >= maxCartItems) {
          throw new Error("Cart is full");
        }

        // Check subscription logic
        if (
          item.type === "subscription" &&
          prevCart.some((cartItem) => cartItem.type === "subscription")
        ) {
          throw new Error("You can only have one subscription at a time");
        }

        // Update existing item or add new one
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }

        // Add new item with quantity tracking and timestamp
        const newItem = {
          ...item,
          quantity: 1,
          addedAt: new Date().toISOString(),
        };

        return [...prevCart, newItem];
      } catch (error) {
        console.error("Error adding item to cart:", error);
        alert(error.message || "Error adding item to cart");
        return prevCart;
      }
    });
  }, [maxCartItems]);

  // Enhanced removeFromCart with confirmation
  const removeFromCart = useCallback((id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }
  }, []);

  // Enhanced updateQuantity with validation
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 0) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, 99) } : item
      )
    );
  }, []);

  // Clear entire cart with confirmation
  const clearCart = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCart([]);
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  // Calculate cart total
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  }, [cart]);

  // Get total number of items
  const getItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cart]);

  // Check if item exists in cart
  const isItemInCart = useCallback(
    (id) => cart.some((item) => item.id === id),
    [cart]
  );

  // Additional utility functions
  const getItemById = useCallback(
    (id) => cart.find((item) => item.id === id),
    [cart]
  );

  const updateItemProperty = useCallback((id, property, value) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, [property]: value } : item
      )
    );
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount,
      isItemInCart,
      getItemById,
      updateItemProperty,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount,
      isItemInCart,
      getItemById,
      updateItemProperty,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// PropTypes validation
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
  maxCartItems: PropTypes.number,
  persistKey: PropTypes.string,
};

// Custom hook for using cart context
export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Example usage of the cart system
const ExampleComponent = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getItemCount,
    clearCart,
  } = useCart();

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      type: "product",
      name: "Example Product",
      price: 29.99,
    };
    addToCart(newItem);
  };

  return (
    <div>
      <h2>Shopping Cart ({getItemCount()} items)</h2>
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={clearCart}>Clear Cart</button>
      
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <div className="quantity-controls">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Total: ${getCartTotal().toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default ExampleComponent;
