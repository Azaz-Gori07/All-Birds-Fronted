import React, { useState, useEffect } from 'react'
import { FiSearch, FiUser, FiShoppingBag, } from 'react-icons/fi'
import { MdHelpOutline } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import './Navbar.css'
import { FaChevronRight } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext/cartContext';

function Navbar({ toggle }) {

  const role = localStorage.getItem("role");
  const navigate = useNavigate();


  const handleProfileClick = () => {
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("user");

    const user = userData ? JSON.parse(userData) : null;

    if (!role || !user || !user.id) {
      navigate("/user");
      return;
    }

    // ✅ agar role mil gaya to profile page
    if (role === "admin" || role === "superadmin") {
      navigate("/dashboard");
    } else {
      navigate(`/profile/${user.id}`); // normal user profile with user.id
    }
  };

  const [openClose, setOpen] = useState(false)

  const HandleNav = () => {
    setOpen(prev => !prev)
  };

  const [drop, setDrop] = useState(null)


  useEffect(() => {
    if (drop) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [drop]);

  const { cartContext } = useCart();

  return (
    <>

      <div className='navbar'>
        <i className="fa-solid fa-bars" onClick={HandleNav}></i>
        <div className="nav1">
          <ul>
            <li className='menDrop' onClick={() => setDrop(prev => (prev === "men" ? null : "men"))}>MEN</li>
            <li onClick={() => setDrop(prev => (prev === "women" ? null : "women"))}>WOMEN</li>
            <Link to='/socks'><li>SOCKS</li></Link>
            <Link to='/new-arrivals'><li>NEW ARRIVALS </li></Link>
          </ul>
        </div>
        <div className="logo">
          <Link to='/'><img src="Allbirds_logo.png" alt="" /></Link>
        </div>
        <div className="nav2">
          <ul>
            <li onClick={() => setDrop(prev => (prev === "sustainability" ? null : "sustainability"))}>SUSTAINABILITY</li>
            <Link to='/reburn'><li>RERUN</li></Link>
            {/* <Link to='/stores'><li>STORES</li></Link> */}
            <a href="https://www.allbirds.com/pages/stores"><li>STORES</li></a>
            {(role === "admin" || role === "superadmin") && (
              <Link to="/dashboard"><li>DashBoard</li></Link>
            )}
            <Link to='/mix'><FiSearch className='icons' /></Link>
            <FiUser className='icons' onClick={handleProfileClick} />
            <Link to='/help'><MdHelpOutline className='icons' /></Link>
            <div className="total">
              <p id='total'>{cartContext.reduce((total, item) => total + item.quantity, 0)}</p>
              <BsCart3 className='icons' onClick={() => toggle(prev => !prev)} />
            </div>
          </ul>

        </div>
        <div className="iconsN">
          <Link to='/mix'><FiSearch className='icons' /></Link>
          <div className="total">
            <p id='total'>{cartContext.reduce((total, item) => total + item.quantity, 0)}</p>
            <BsCart3 className='icons' onClick={() => toggle(prev => !prev)} />
          </div>
        </div>
      </div>


      {openClose && (

        <div className="sidenav" onClick={HandleNav}>

          <Link to='/men'><li>MEN  <FaChevronRight /></li></Link>
          <Link to='/women'><li>WOMEN  <FaChevronRight /></li></Link>
          <Link to='/socks'><li>SOCKS  <FaChevronRight /></li></Link>
          <Link to='/new-arrivals'><li>NEW ARRIVALS <FaChevronRight /></li></Link>
          <Link to='/sustainability'><li>SUSTAINABILITY  <FaChevronRight /></li></Link>
          <Link to='/reburn'><li>REBURN  <FaChevronRight /></li></Link>
          <Link to='/stores'><li>STORES  <FaChevronRight /></li></Link>
          <li onClick={handleProfileClick}>Account  <FaChevronRight /></li>
          <Link to='/help'><li>Help <FaChevronRight /></li></Link>
        </div>
      )}



      {drop === 'men' && (
        <div className={`main-1 ${drop === "men" ? "open" : ""}`}>
          <div className="links">
            <h1>SHOES</h1>

            <ul>
              <li>Sneakers</li>
              <li>Slip Ons</li>
              <li>High Tops</li>
              <li>Sandals</li>
              <li>All-Weather</li>
              <li>Sale</li>
              <li>Shop All</li>
            </ul>
          </div>
          <div className="links">
            <h1>BESTSELLERS</h1>

            <ul>
              <li>Tree Runner Go</li>
              <li>Tree Dasher 2</li>
              <li>Canvas Piper</li>
              <li>Tree Runner</li>
              <li>Tree Glider</li>
              <li>Tree Dasher Relay</li>
              <li>Wool Runner Go</li>
              <li>Shop All</li>
            </ul>
          </div>
          <div className="links">
            <h1>APPAREL & MORE</h1>

            <ul>
              <li>Socks</li>
              <li>Tees</li>
              <li>Sweats</li>
              <li>Bags</li>
              <li>Hats</li>
              <li>Insoles</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div className="featureCom">
            <h1>FEATURED</h1>

            <div className="mens-Arrivals">
              <div className="arrivals-1">
                <img src="Mens_New_Arrivals_25Q2_UtilityCollection_Site_NavTile_Mens_Desktop_1125x324.avif" alt="" />
                <p>MEN'S NEW ARRIVALS</p>
              </div>
              <div className="arrivals-1">
                <img src="25Q2_White_Sneakers_Season_Site_NavTile_Mens_Desktop_1125x324.avif" alt="" />
                <p>TRENDING: WHITE SNEAKS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {drop === 'women' && (
        <div className={`main-1 ${drop === 'women' ? 'open' : ""}`}>
          <div className="links">
            <h1>SHOES</h1>

            <ul>
              <li>Sneakers</li>
              <li>Slip Ons</li>
              <li>High Tops</li>
              <li>Flats</li>
              <li>Sandals</li>
              <li>All-Weather</li>
              <li>Sale</li>
              <li>Shop All</li>
            </ul>
          </div>
          <div className="links">
            <h1>BESTSELLERS</h1>

            <ul>
              <li>Tree Runner Go</li>
              <li>Tree Dasher 2</li>
              <li>Canvas Piper</li>
              <li>Tree Runner</li>
              <li>Tree Glider</li>
              <li>Tree Dasher Relay</li>
              <li>Wool Runner Go</li>
              <li>Shop All</li>
            </ul>
          </div>
          <div className="links">
            <h1>APPAREL & MORE</h1>

            <ul>
              <li>Socks</li>
              <li>Tees</li>
              <li>Sweats</li>
              <li>Bags</li>
              <li>Hats</li>
              <li>Insoles</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div className="featureCom">
            <h1>FEATURED</h1>

            <div className="mens-Arrivals">
              <div className="arrivals-1">
                <img src="Mens_New_Arrivals_25Q2_UtilityCollection_Site_NavTile_Mens_Desktop_1125x324.avif" alt="" />
                <p>MEN'S NEW ARRIVALS</p>
              </div>
              <div className="arrivals-1">
                <img src="25Q2_White_Sneakers_Season_Site_NavTile_Mens_Desktop_1125x324.avif" alt="" />
                <p>TRENDING: WHITE SNEAKS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {drop === 'sustainability' && (
        <div
          className={`main-1-SustainAbility ${drop === "sustainAbility" ? "open" : ""}`}
        >
          <div className="links">
            <h1>SHOES</h1>

            <ul>
              <li>Our Sustainability Strategy</li>
              <li>M0.0NSHOT</li>
              <li>How We Operate</li>
              <li>Carbon Footprint</li>
              <li>Renewable Materials</li>
              <li>Carbon Offsets</li>
              <li>Responsible Energy</li>
            </ul>
          </div>

          <div className="featureCom">
            <h1>FEATURED</h1>

            <div className="mens-Arrivals">
              <div className="arrivals-1">
                <img src="23Q2-Earth_Day-Site-Nav_Tile-1125x324.avif" alt="" />
                <p>OUR SUSTAINABILITY STRATEGY</p>
              </div>
              <div className="arrivals-1">
                <img src="ReRun-Site-NavTiles-Web.avif" alt="" />
                <p>ALLBURDS ReRUN™ MARKETPLACE</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
