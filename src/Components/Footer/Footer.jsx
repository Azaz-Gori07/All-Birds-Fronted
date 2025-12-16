
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* HELP */}
        <div className="footer-col">
          <h3>HELP</h3>
          <ul>
            <li><a href="#">Chat with us!</a></li>
            <li><a href="#">1-888-963-8944</a></li>
            <li><a href="#">1-814-251-9966 (Text)</a></li>
            <li><a href="mailto:help@allbirds.com">help@allbirds.com</a></li>
            <li><a href="#">Returns/Exchanges</a></li>
            <li><a href="#">FAQ/Contact Us</a></li>
            <li><a href="#">Afterpay</a></li>
          </ul>
        </div>

        {/* SHOP */}
        <div className="footer-col">
          <h3>SHOP</h3>
          <ul>
            <li><a href="#">Men's Shoes</a></li>
            <li><a href="#">Women's Shoes</a></li>
            <li><a href="#">Men's Apparel</a></li>
            <li><a href="#">Women's Apparel</a></li>
            <li><a href="#">Socks</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Refer a Friend</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="footer-col">
          <h3>COMPANY</h3>
          <ul>
            <li><a href="#">Our Stores</a></li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Our Materials</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Investors</a></li>
            <li><a href="#">Shoe Care</a></li>
            <li><a href="#">Affiliates</a></li>
            <li><a href="#">Bulk Orders</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Allbirds Responsible Disclosure Program</a></li>
            <li><a href="#">California Transparency Act</a></li>
            <li><a href="#">Community Offers</a></li>
            <li><a href="#">Our Blog</a></li>
            <li><a href="#">Patents</a></li>
          </ul>
        </div>

        {/* FOLLOW THE FLOCK */}
        <div className="footer-col">
          <h3>FOLLOW THE FLOCK</h3>
          <p>Exclusive offers, a heads up on new things, and sightings of Allbirds in the wild. Oh, we have cute sheep, too. #allbirds</p>
          <div className="social-icons">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-tiktok"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-youtube"></i>
            <i className="fa-brands fa-pinterest"></i>
          </div>
          <div className="bcorp">
            <p>Certified B Corporation</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/B_Corp_logo.svg" alt="B Corp" />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="footer-flags">
        <img src="https://flagcdn.com/us.svg" alt="US" />
        <img src="https://flagcdn.com/ca.svg" alt="Canada" />
        <img src="https://flagcdn.com/nz.svg" alt="New Zealand" />
        <img src="https://flagcdn.com/au.svg" alt="Australia" />
        <img src="https://flagcdn.com/gb.svg" alt="UK" />
        <img src="https://flagcdn.com/cn.svg" alt="China" />
        <img src="https://flagcdn.com/eu.svg" alt="EU" />
        <img src="https://flagcdn.com/jp.svg" alt="Japan" />
        <img src="https://flagcdn.com/kr.svg" alt="South Korea" />
        <img src="https://flagcdn.com/ae.svg" alt="UAE" />
        <img src="https://flagcdn.com/be.svg" alt="Belgium" />
        <img src="https://flagcdn.com/nl.svg" alt="Netherlands" />
        <img src="https://flagcdn.com/fr.svg" alt="France" />
        <img src="https://flagcdn.com/ie.svg" alt="Ireland" />
        <img src="https://flagcdn.com/in.svg" alt="India" />
      </div>

      <div className="footer-bottom">
        <p>© 2025 Allbirds, Inc. All Rights Reserved. <Link to='/Terms'>Terms</Link>, <Link to='/Privacy'>Privacy</Link> & <Link to='/Accessibility'>Accessibility</Link></p>
        <a href="#">Do Not Sell My Personal Information</a>
      </div>
    </footer>
  );
};

export default Footer;