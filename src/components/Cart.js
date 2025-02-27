import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../CartContext"; // Import CartContext
import "../Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const increaseItem = (id) => {
    updateQuantity(id, cart.find(item => item.id === id).quantity + 1);
  };

  const decreaseItem = (id) => {
    const item = cart.find(item => item.id === id);
    if (item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Add some items before checking out.");
    } else {
      localStorage.setItem(
        "cartTotal",
        cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
      );
      navigate('/checkout');
    }
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  
  return (
    <motion.div className="cart-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="cart-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Shopping
        </Link>
        <h2>Your Cart ({cart.length} items)</h2>
      </div>

      {cart.length === 0 ? (
        <motion.div className="empty-cart" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <FaShoppingCart className="empty-cart-icon" />
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </motion.div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <AnimatePresence>
              {cart.map((item) => (
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
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <div className="item-quantity">
                      <button className="decrease-btn" onClick={() => decreaseItem(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="increase-btn" onClick={() => increaseItem(item.id)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <FaTrash />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div className="cart-summary" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>${(parseFloat(getTotalPrice()) * 1.1).toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
