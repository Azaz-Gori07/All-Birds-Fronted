import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import './Swiper.css'; //
import { Link } from 'react-router-dom';

const cards = [
  {
    image: '/ColorFlow1.avif',
    title: 'Bestsellers',
    subtitle: 'Fan-Favorite Sneakers, Flats, and Slip-Ons'
  },
  {
    image: '/ColorFlow2.avif',
    title: 'New Arrivals',
    subtitle: 'The Latest Style & Limited-Edition Colors'
  },
  {
    image: '/ColorFlow3.avif',
    title: 'Spring Essentials',
    subtitle: 'Breezy Shoes For Warmer Days Ahead'
  }
];

export default function ResponsiveCards() {
  return (
    <>
      {/* Desktop view */}
      <div className="cards-desktop hidden md:flex">
        {cards.map((card, index) => (
          <div key={index} className="card-container">
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-text">
              <h1>{card.title}</h1>
              <p>{card.subtitle}</p>
            </div>
            <div className="card-buttons">
              <Link to="/women"><button className="shop-button">SHOP WOMEN</button></Link>
              <Link to="/men"><button className="shop-button">SHOP MEN</button></Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile slider */}
      <div className="cards-mobile block md:hidden">
        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}
          pagination={{ clickable: true }}
          modules={[Pagination]}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div className="mobile-slide">
                <img src={card.image} alt={card.title} className="mobile-image" />
                <div className="mobile-text">
                  <h2>{card.title}</h2>
                  <p>{card.subtitle}</p>
                </div>

                <div className="card-buttons">
                  <button className="shop-button-mobile">Shop Women</button>
                  <button className="shop-button-mobile">Shop Men</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

