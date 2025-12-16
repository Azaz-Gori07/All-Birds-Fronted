import React, { useState, useEffect } from 'react';
import './NewArrivals.css';
import men from '../../APIs/MenWomendata.json';
import { Link } from 'react-router-dom';

function NewArrivals() {
  const [activeTab, setActiveTab] = useState("men");
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);

  useEffect(() => {
    const menShoes = men.filter((item) => item.gender === "Men");
    const womenShoes = men.filter((item) => item.gender === "Women");
    
    setMenProducts(menShoes);
    setWomenProducts(womenShoes);
  }, []);

  const currentProducts = activeTab === "men" ? menProducts : womenProducts;

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  return (
    <>
      {/* Responsive Header */}
      <div className="arrivals-header">
        <img src="https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1920/cms/3JpUTVLHglPcAepDsBbAFS/e735a5ba62e71d40e97263b26ff63ec3/25Q2_HazyPine_Site_CustomCollection_Banner_Desktop_2880x710-TRGo.jpg" alt="New Arrivals" />
        <div className="arrivals-header-details">
          <div className="max-width">
            <h1>New Arrivals</h1>
            <p>The latest styles and limited edition colors that you can only find here (while they last, that is.)</p>
          </div>
        </div>
      </div>

      {/* Responsive Switching Options */}
      <div className="page-changer-links">
        <div 
          className={`tab-item ${activeTab === "men" ? "active" : ""}`}
          onClick={() => setActiveTab("men")}
        >
          Men's New Arrivals
        </div>
        <div 
          className={`tab-item ${activeTab === "women" ? "active" : ""}`}
          onClick={() => setActiveTab("women")}
        >
          Women's New Arrivals
        </div>
      </div>

      {/* Products Grid - Unchanged */}
      <div className="clean-container">
        <div className="products-count">
          <p>Showing {currentProducts.length} products</p>
        </div>

        <div className="clean-grid">
          {currentProducts.map(product => (
            <Link key={product.id} to={`/items/active/${product.id}`}>
            <div className="clean-card">
              <div className="card-image-container">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x400/f5f5f5/999999?text=No+Image";
                  }}
                />
                
                {product.discount && (
                  <div className="simple-badge">
                    {product.discount} OFF
                  </div>
                )}
                
                <button className="wishlist-icon">
                  ♡
                </button>
              </div>

              <div className="card-content">
                <h3 className="product-name">{product.title}</h3>
                <p className="product-category">{product.type} • {product.color}</p>
                <p className="product-description">{product.detail}</p>
                
                <div className="price-container">
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default NewArrivals;