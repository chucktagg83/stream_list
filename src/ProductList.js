// Products.js
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Products.css';

const Products = () => {
  const { addToCart, hasSubscriptionInCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch or define your products
    const fetchProducts = async () => {
      // This is a placeholder. In a real app, you'd fetch from an API
      const productData = [
        {
          id: 1,
          title: "Basic Subscription",
          price: 9.99,
          image: "/images/basic-subscription.jpg",
          description: "Access to all basic features"
        },
        {
          id: 2,
          title: "Standard Subscription",
          price: 14.99,
          image: "/images/standard-subscription.jpg",
          description: "Access to all standard features including HD streaming"
        },
        {
          id: 3,
          title: "Premium Subscription",
          price: 19.99,
          image: "/images/premium-subscription.jpg",
          description: "Access to all premium features including 4K streaming and offline downloads"
        },
        {
          id: 4,
          title: "Family Subscription",
          price: 24.99,
          image: "/images/family-subscription.jpg",
          description: "Premium features for up to 5 family members"
        },
        // Add more products as needed (non-subscription products)
        {
          id: 5,
          title: "Movie Rental: Latest Action",
          price: 4.99,
          image: "/images/action-movie.jpg",
          description: "Rent the latest action blockbuster for 48 hours"
        },
        // ... more products
      ];
      
      setProducts(productData);
    };
    
    fetchProducts();
  }, []);
  
  // Check if a product is a subscription
  const isSubscription = (productId) => {
    return productId >= 1 && productId <= 4;
  };
  
  // Handle adding to cart with subscription check
  const handleAddToCart = (product) => {
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
  const isSubscriptionDisabled = (productId) => {
    return isSubscription(productId) && hasSubscriptionInCart();
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Choose from our selection of subscriptions and rentals</p>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image && <img src={product.image} alt={product.title} />}
            </div>
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">${product.price.toFixed(2)}</div>
              <div className="product-actions">
                <button 
                  className={`add-to-cart-btn ${isSubscriptionDisabled(product.id) ? 'disabled' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={isSubscriptionDisabled(product.id)}
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
        ))}
      </div>
    </div>
  );
};

export default Products;
