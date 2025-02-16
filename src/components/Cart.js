import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Get cart items from local storage (if any)
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    // For now, just an alert for demonstration
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some items before checking out.");
    } else {
      alert("Proceeding to checkout...");
      // You can add navigation to checkout page here if you have one
      // For example: navigate('/checkout') if you use react-router
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <div>
                  <img src={item.img} alt={item.service} width="50" />
                  <h3>{item.service}</h3>
                  <p>{item.serviceInfo}</p>
                  <p>Price: ${item.price}</p>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <h3>Total Price: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</h3>
          </div>
          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            style={{
              marginTop: "20px",
              fontSize: "18px",        // Increases the font size
              padding: "12px 24px",    // Increases the padding (height and width of the button)
              borderRadius: "8px",     // Rounds the corners of the button
              backgroundColor: "#007BFF", // Button color
              color: "white",          // Text color
              border: "none",          // Removes border
              cursor: "pointer"        // Makes it a clickable button
            }}
>
  Checkout
</button>

        </div>
      )}
      <Link to="/">Go back to shopping</Link>
    </div>
  );
};

export default Cart;
