import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import "../Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(savedCartItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some items before checking out.");
    } else {
      // Save cart total to localStorage for checkout page
      localStorage.setItem("cartTotal", 
        cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)
      );
      navigate('/checkout');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="cart-loading">
        <FaShoppingCart className="loading-icon" />
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="cart-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="cart-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Shopping
        </Link>
        <h2>Your Cart ({cartItems.length} items)</h2>
      </div>

      {cartItems.length === 0 ? (
        <motion.div 
          className="empty-cart"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <FaShoppingCart className="empty-cart-icon" />
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="item-image">
                    <img src={item.img} alt={item.service} />
                  </div>
                  <div className="item-details">
                    <h3>{item.service}</h3>
                    <p>{item.serviceInfo}</p>
                    <p className="item-price">${item.price}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            className="cart-summary"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>${(parseFloat(getTotalPrice()) * 1.1).toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
