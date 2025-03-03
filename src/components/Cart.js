import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported
import { CartContext } from './CartContext';
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaEraser, FaCreditCard } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Apply fixed shipping fee
  const shipping = subtotal > 0 ? 5.99 : 0;
  
  // Calculate total with discount if coupon applied
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = () => {
    // Simple coupon logic - in a real app, this would validate against a database
    if (couponCode.toUpperCase() === 'EZTECH20' && !couponApplied) {
      const discount = subtotal * 0.2; // 20% discount
      setCouponDiscount(discount);
      setCouponApplied(true); 
    }
  };

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      clearCart();
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponCode('');
    }
  };

  // Add this function to handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id} className="cart-item">
                      <td className="product-info">
                        <div className="product-image">
                          {item.image && <img src={item.image} alt={item.title} />}
                        </div>
                        <div className="product-details">
                          <h3>{item.title}</h3>
                          {item.description && <p className="product-description">{item.description}</p>}
                        </div>
                      </td>
                      <td className="product-price">${item.price.toFixed(2)}</td>
                      <td className="product-quantity">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="product-total">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="product-remove">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                          aria-label="Remove item"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="cart-actions">
                <Link to="/products" className="continue-shopping-btn">
                  <FaArrowLeft /> Continue Shopping
                </Link>
                <button 
                  onClick={handleEmptyCart} 
                  className="empty-cart-btn"
                  aria-label="Empty cart"
                >
                  <FaEraser /> Empty Cart
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              {couponApplied && (
                <div className="summary-row discount">
                  <span>Discount (20%)</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="coupon-section">
                <h3>Have a coupon?</h3>
                <div className="coupon-input">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <div className="coupon-applied">
                    Coupon EZTECH20 applied successfully!
                  </div>
                )}
              </div>
              
              {/* Updated checkout button with onClick handler */}
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <FaCreditCard /> Proceed to Checkout
              </button>
              
              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons">
                  <span className="payment-icon">Visa</span>
                  <span className="payment-icon">MC</span>
                  <span className="payment-icon">Amex</span>
                  <span className="payment-icon">PayPal</span>
                </div>
              </div> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
