import React from "react";
import list from "../data";  // Import list data

const Product = ({ addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <div className="products">
        {list
          .filter((item) => !item.service.includes("Subscription")) // Only products
          .map((item) => (
            <div key={item.id} className="product-card">
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

export default Product;
