import React, { useRef } from "react";
import Slider from "react-slick";
import { faChevronCircleRight, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slidedata = [
  { id: 1, img: "/images/Banner.jpeg" },
  { id: 2, img: "/images/Banner2.jpeg" },
  { id: 3, img: "/images/Banner3.jpeg" },
];

export default function Header() {
  const sliderRef = useRef(null);

  const configuracaoSlide = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <header>
      <Slider ref={sliderRef} {...configuracaoSlide}>
        {Slidedata.map((slide) => (
          <div key={slide.id} className="banner-slide">
            <div className="inner-content no-content">
              <div className="right-side">
                <img src={slide.img} alt={`Banner ${slide.id}`} className="animate-image" />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </header>
  );
}
