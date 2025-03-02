// src/Components/OrderConfirmation.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaFileAlt } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  
  // If no order data is passed, redirect to home
  if (!order) {
    navigate('/');
    return null;
  }
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <h1>Order Confirmed!</h1>
        <p className="thank-you-message">Thank you for your purchase</p>
        
        <div className="order-details">
          <div className="order-info-row">
            <span>Order Number:</span>
            <span>{order.id}</span>
          </div>
          <div className="order-info-row">
            <span>Date:</span>
            <span>{formatDate(order.date)}</span>
          </div>
          <div className="order-info-row">
            <span>Payment Method:</span>
            <span>{order.paymentMethod} (**** {order.cardLast4})</span>
          </div>
          <div className="order-info-row total">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="order-items">
          <h3>Order Items</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index} className="order-item">
                <div className="item-info">
                  <span className="item-title">{item.title}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            <FaHome /> Continue Shopping
          </button>
          <button 
            className="receipt-button"
            onClick={() => {
              // In a real app, this would generate a PDF receipt
              alert('Receipt download functionality would be implemented here');
            }}
          >
            <FaFileAlt /> Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
