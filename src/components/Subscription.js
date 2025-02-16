import React from "react";
import list from "../data";  // Import list data

const Subscription = ({ addToCart }) => {
  return (
    <div>
      <h2>Subscription Plans</h2>
      <div className="subscriptions">
        {list
          .filter((item) => item.service.includes("Subscription")) // Only subscriptions
          .map((item) => (
            <div key={item.id} className="subscription-card">
              <img src={item.img} alt={item.service} />
              <h3>{item.service}</h3>
              <p>{item.serviceInfo}</p>
              <p>${item.price.toFixed(2)}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Subscription;
