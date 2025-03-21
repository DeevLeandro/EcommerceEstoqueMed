import React, { useRef } from "react";
import Slider from "react-slick";
import { faChevronCircleRight, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slidedata = [
  {
    id: 1,
    img: "/images/Banner.png",
    subtitulo: "Ofertas Exclusivas",
    titulo: "Descubra Nossas Melhores Ofertas",
    titulo2: "Promoções Imperdíveis!",
    descricao: "Aproveite descontos incríveis em uma ampla gama de produtos. Ofertas por tempo limitado!",
  },
  {
    id: 2,
    img: "/images/Banner2.png",
    subtitulo: "Entrega Rápida",
    titulo: "Receba Seus Produtos Rapidamente!",
    titulo2: "Comodidade e Velocidade",
    descricao: "Garantimos entrega em tempo recorde para que você aproveite seus produtos o quanto antes.",
  },
  {
    id: 3,
    img: "/images/Banner3.png",
    subtitulo: "Equipamentos de Qualidade",
    titulo: "Os Melhores Equipamentos para o Seu Negócio",
    titulo2: "Tecnologia e Eficiência",
    descricao: "Descubra soluções inovadoras para o seu empreendimento com produtos de alta performance.",
  },
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
      <div className="container">
        <Slider ref={sliderRef} {...configuracaoSlide}>
          {Slidedata.map((slide) => (
            <div key={slide.id} className="banner-slide">
              <div className="inner-content">
                <div className="left-side">
                  <h2 className="hero-subtitle animate-text">{slide.subtitulo}</h2>
                  <h1 className="hero-title animate-text">{slide.titulo}</h1>
                  <h3 className="hero-title animate-text">{slide.titulo2}</h3>
                  <p className="hero-description animate-text">{slide.descricao}</p>
                </div>
                <div className="right-side">
                  <img src={slide.img} alt={slide.titulo} className="responsive-img animate-image" />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </header>
  );
}
