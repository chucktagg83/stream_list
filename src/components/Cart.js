import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaArrowLeft, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { CartContext } from "../CartContext";
import "../Cart.css"; // You'll need to update your CSS with the styles below

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  // Increase item quantity
  const increaseItem = (id) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  // Decrease item quantity
  const decreaseItem = (id) => {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Add some items before checking out.");
    } else {
      const cartTotal = getTotalPrice();
      localStorage.setItem("cartTotal", cartTotal);
      navigate('/checkout');
    }
  };

  // Get total price
  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = item.quantity || 0;
      return total + itemPrice * itemQuantity;
    }, 0);
    return total.toFixed(2);
  };

  // Calculate tax and final total
  const subtotal = parseFloat(getTotalPrice());
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <motion.div 
      className="cart-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="cart-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> <span>Continue Shopping</span>
        </Link>
        <h1>Your Cart <span className="item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span></h1>
      </div>

      {cart.length === 0 ? (
        <motion.div 
          className="empty-cart"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="empty-cart-icon-container">
            <FaShoppingCart className="empty-cart-icon" />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any services to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Browse Services
          </Link>
        </motion.div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            <div className="cart-items-header">
              <span className="header-product">Product</span>
              <span className="header-price">Price</span>
              <span className="header-quantity">Quantity</span>
              <span className="header-total">Total</span>
              <span className="header-actions"></span>
            </div>
            
            <div className="cart-items">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="item-product">
                      <div className="item-image">
                        <img src={item.img || "/images/placeholder-service.jpg"} alt={item.service || "Service"} />
                      </div>
                      <div className="item-info">
                        <h3>{item.service || "Unnamed Service"}</h3>
                        <p className="item-description">{item.serviceInfo || "No description available"}</p>
                      </div>
                    </div>
                    
                    <div className="item-price">${(item.price || 0).toFixed(2)}</div>
                    
                    <div className="item-quantity-control">
                      <button 
                        className="quantity-btn decrease-btn" 
                        onClick={() => decreaseItem(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        className="quantity-btn increase-btn" 
                        onClick={() => increaseItem(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="remove-btn" 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            className="cart-summary"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2>Order Summary</h2>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row discount-row">
                <input 
                  type="text" 
                  placeholder="Promo code" 
                  className="promo-input"
                />
                <button className="apply-promo-btn">Apply</button>
              </div>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">${total.toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            
            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <span className="payment-icon visa"></span>
                <span className="payment-icon mastercard"></span>
                <span className="payment-icon amex"></span>
                <span className="payment-icon paypal"></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
