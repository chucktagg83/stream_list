// ProductCard.js
import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ProductCard.css'; // Create this file for styling

const ProductCard = ({ product }) => {
  const { addToCart, hasSubscriptionInCart } = useContext(CartContext);
  
  // Check if a product is a subscription
  const isSubscription = (productId) => {
    return productId >= 1 && productId <= 4;
  };
  
  // Handle adding to cart with subscription check
  const handleAddToCart = () => {
    // If it's a subscription and we already have one in the cart
    if (isSubscription(product.id) && hasSubscriptionInCart()) {
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
      return; // Don't proceed with adding to cart
    }
    
    // Otherwise, add to cart as normal
    addToCart(product);
  };
  
  // Check if this subscription should be disabled
  const isSubscriptionDisabled = () => {
    return isSubscription(product.id) && hasSubscriptionInCart();
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image && <img src={product.image} alt={product.title} />}
      </div>
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className="product-actions">
          <button 
            className={`add-to-cart-btn ${isSubscriptionDisabled() ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={isSubscriptionDisabled()}
          >
            <FaShoppingCart /> Add to Cart
          </button>
          <button className="info-btn">
            <FaInfoCircle /> Details
          </button>
        </div>
        {isSubscription(product.id) && (
          <div className="subscription-badge">Subscription</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
