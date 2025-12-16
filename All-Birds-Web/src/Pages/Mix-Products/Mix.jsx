import React, { useEffect } from 'react'
import './Mix.css'
import { FiSearch } from "react-icons/fi";
import Products from '../../APIs/mixProducts.json'
import { Link } from 'react-router-dom';


function Mix() {

  return (
    <>
      <div className='mix-body'>

        <div className="search-input">

          <h1 className='search-results'>Search Results</h1>
          <div className="search-container">
            <FiSearch className='search-icon' />
            <input type="text" placeholder='Enter Search Term' className='search-term' />

            {/* ////search-container///// */}
          </div>

          {/* /////search-inpute///// */}
        </div>

        <div className="mix-products">
          {Products.map((product) => (
            <>
              <Link
                to={`/items/mix/${product.id}`}
                key={product.id}
                className='mix-card-link'
              >
                <div className="mix-card">
                  <div className="mix-card-image">
                    <img src={product.image} alt={product.color} />
                  </div>

                  <div className="mix-card-details">
                    <h2 className='mix-card-title'>{product.title}</h2>
                    <p className='mix-card-color'>{product.color}</p>
                    <p className='mix-card-price'>${product.price} <del>${product.originalPrice}</del></p>
                  </div>
                </div>
              </Link>
            </>
          ))}

          {/* ////mix-products///// */}
        </div>

        {/* /////mix-body///// */}
      </div>
    </>
  )
}

export default Mix
