import React from "react";
import './Slickes.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { Link } from "react-router-dom";
import cardData from '../../APIs/cardsdata.json'

const CardSlider = () => {

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className='slick-Right' onClick={onClick}>
        <FaChevronRight />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="slick-Left" onClick={onClick}>
        <FaChevronLeft />
      </div>
    );
  };



  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: 4, // Desktop
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768, // Small Tablet
        settings: {
          speed: 400,
          slidesToShow: 2.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480, // Mobile
        settings: {
          speed: 300,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="slider" style={{ maxWidth: '1400px', margin: 'auto' }}>
      <Slider {...settings}>
        {cardData.map((card) => (
          <Link className="items-slick" key={card.id} to={`/items/home2/${card.id}`}>
          <div className="slicker-card">
            <div className="img-div">
              <img src={`/${card.image}`} alt={card.title} className="image-s" />
            </div>
            <div className="props">
              <h3 className="detail-s">{card.detail}</h3>
              <p className="title-s">{card.title}</p>
              <p className="price-s">₹{card.price}</p>
            </div>
          </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;
