import React, { useEffect } from 'react'
import './Cart.css'
import { GrClose } from "react-icons/gr";
import { useCart } from '../../Components/CartContext/cartContext'
import { FaPlus } from "react-icons/fa6";
import { LuMinus } from "react-icons/lu";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isTokenValid } from '../../utils/authCheck';


function Cart({ openCart, setOpenCart }) {

  const navigate = useNavigate();
  const location = useLocation();

  const { cartContext, increaseQuantity, decreaseQuantity, deleteProduct } = useCart();


  useEffect(() => {
    if (openCart) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [openCart]);


  useEffect(() => {
    setOpenCart(false);
  }, [location.pathname]);

  const closeCart = () => setOpenCart(false);

  const getTotalPrice = () => {
    return cartContext.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || !isTokenValid()) {
      alert("Please login to continue");
      closeCart();
      navigate("/user");
      return;
    }

    // ✅ Token valid, user logged in
    closeCart();
    navigate("/checkout");
  };


  return (
    <>
      <div className={openCart ? "cart-show" : "cart-hide"}>
        <div className="index">
          <div className="values">
            <h2 className='cart'>
              CART ({cartContext.reduce((total, item) => total + item.quantity, 0)})
            </h2>
            <p className='note'>You've earned free shipping!</p>
            <div id='close'><GrClose onClick={() => setOpenCart(prev => !prev)} /></div>
          </div>
          <div className="devider"></div>
        </div>

        <div className="added-items">
          {
            cartContext.map((item) => (
              <div className="items" key={item.id}>
                <img
                  src={
                    item?.image
                      ? item.image.startsWith('http')
                        ? item.image
                        : `/${item.image}`
                      : '/fallback.jpg'
                  }
                  className='item-image'
                />
                <div className="details">
                  <h3>{item.title}</h3>
                  <p className='p1'>Color: {item.color} {item.detail}</p>
                  <p className='size'>Size: {item.size}</p>
                  <p className='quantity'>
                    <LuMinus id='decrease' onClick={() => decreaseQuantity(item.id)} />
                    &nbsp;{item.quantity}&nbsp;
                    <FaPlus id='increase' onClick={() => increaseQuantity(item.id)} />
                  </p>
                </div>

                <div className="remove">
                  <h3>US${Math.trunc(item.price * item.quantity)}</h3>
                  <GrClose onClick={() => deleteProduct(item.id)} className='cursor-pointer' />
                </div>
              </div>
            ))
          }
        </div>

        <div className="paymentSection">
          <p className='headline'><span>Add Gift Note & Logo Free Packaging +</span></p>
          <div className="total-price">
            <h1 className='subtotal'><b>Subtotal</b> <b>US${Math.trunc(getTotalPrice())}</b></h1>


            <Link to='/checkout' className='lk' onClick={handleCheckout}>
              <button className='checkout'>CHECKOUT</button>
            </Link>
          </div>
          <div className="payment-option">
            <button className='amazone-pay' onClick={closeCart}>
              <img src="/assest/Amazon_Pay__Black.svg" alt="" />
            </button>
            <button className='paypal' onClick={closeCart}>
              <img src="/assest/PayPal_-_Color.svg" alt="" />
            </button>
            <button className='shoppay' onClick={closeCart}>
              <img src="/assest/ShopPay_-_White.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
