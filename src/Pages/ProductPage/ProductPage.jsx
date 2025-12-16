// ProductPage.jsx
import React, { useEffect, useState } from 'react';
import './ProductPage.css'
import allProducts from '../../APIs/allProducts';
import { useParams } from 'react-router-dom';
import EmailAprroch from '../../Components/ApproachCard/ApprochSection'
import { useCart } from '../../Components/CartContext/cartContext';

export default function ProductPage() {

  const { type, id } = useParams();
  const product = allProducts.find(p => p.id == parseInt(id) && p.type == type);

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("")

  const HandleSize = () => {
    if (!selectedSize) {
      alert("Please Select Your Size and Continue..");
    }
  }


  return (

    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Product Image Section */}
          <div className="space-y-4">
            <img
              src={
                product?.image
                  ? product.image.startsWith('http')
                    ? product.image
                    : `/${product.image}`
                  : '/fallback.jpg' // Put a fallback.jpg in public/
              }
              alt={product?.title || 'No image'}
              className="w-full rounded-xl shadow-sm"
            />
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col justify-center space-y-4 gap-4">
            <div className='flex flex-col gap-2'>
              <h1 className="text-2xl font-semibold text-gray-800">{product?.title} {product?.gender}</h1>
              <h1 className="text-1xl font-normal text-gray-5800">{product?.color} {product?.detail}</h1>
              <div className="price flex gap-3">
                <p className="text-gray-600  mt-1"><b>$</b>{product?.price}</p>
                <p className="text-red-600  mt-1"><del className="del">{product?.originalPrice} {product?.discount}</del></p>
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color:</label>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-black border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-gray-400 border border-gray-300 cursor-pointer"></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
              <select className="w-full p-2 rounded-md border border-gray-300"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Choose size</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <button className="mt-4 bg-black text-white py-2 px-6 rounded-xl hover:bg-gray-900 transition"
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size before adding to cart.");
                  return;
                }
                addToCart({ ...product, size: selectedSize, quantity: 1 });
              }}>
              Add to Cart
            </button>
          </div>

        </div>
      </div>

      <EmailAprroch />
    </>
  );
}
