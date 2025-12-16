import React from 'react';
import './ProductSlider.css';
import { Link } from 'react-router-dom';
import products from '../../APIs/homeProductData.json'

const ProductSlider = () => {
  return (
    <div className="slider-container">
      {products.map((product) => (
        <Link
        key={product.id}
        to={`/items/home1/${product.id}`} 
        >
        <div className="card">
          <img src={product.image} alt={product.title} />
          <div className="details-cont">
            <h3 className='title'>{product.title}</h3>
            <p className='detail'>{product.detail}</p>
            <p className='price'>₹{product.price}</p>
          </div>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductSlider;
