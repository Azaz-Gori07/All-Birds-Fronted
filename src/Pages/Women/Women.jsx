import React, { useState } from 'react';
import men from '../../APIs/MenWomendata.json';
import { useCart } from '../../Components/CartContext/cartContext';
import './Women.css'; // Import the CSS file

export default function WomenShoesPage() {
  const { addToCart } = useCart();
  const womenShoes = men.filter((item) => item.gender === "Women");

  return (
    <div className="men-page-container">
      <h2 className="men-page-heading">Women Shoes</h2>
      <div className="men-products-grid">
        {womenShoes.map((product) => {
          const [selectedSize, setSelectedSize] = useState("");

          return (
            <div key={product.id} className="men-card">
              <div className="img-section">
                <img
                  src={product.image}
                  alt={product.title}
                  className="men-card-image"
                />
              </div>
              <div className="details">
                <h3 className="men-card-title">{product.title}</h3>
                <p className="men-card-detail">{product.detail}</p>
                <p className="men-card-price">₹{product.price}</p>
              </div>

              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="men-size-select"
              >
                <option value="">Choose size</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>

              <button
                onClick={() => {
                  if (!selectedSize) return alert("Please select a size");
                  addToCart({ ...product, size: selectedSize, quantity: 1 });
                }}
                className="men-add-button"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
