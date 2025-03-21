import React, { useEffect, useState } from 'react';


const Mapa = () => {
  const endereco = "Estoque med Goiânia - GO, 74356-048";
  const [imageStyle, setImageStyle] = useState({});

  // Movimento suave da imagem
  useEffect(() => {
    let positionX = 0;
    let positionY = 0;
    let directionX = 1;
    let directionY = 1;

    const interval = setInterval(() => {
      positionX += directionX * 0.5;
      positionY += directionY * 0.3;

      if (positionX > 10 || positionX < -10) directionX *= -1;
      if (positionY > 5 || positionY < -5) directionY *= -1;

      setImageStyle({
        transform: `translate(${positionX}px, ${positionY}px)`,
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Função para abrir o Google Maps
  const abrirMapa = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mapa-container">
      <h3 className="mapa-title">Visite-nos</h3>
      <div className="mapa-wrapper" onClick={abrirMapa}>
        <img
          src="/images/Mapa2.png"
          alt="Mapa Animado"
          className="mapa-imagem"
          style={imageStyle}
        />
        <p className="mapa-texto">Clique no mapa para abrir </p>
      </div>
    </div>
  );
};

export default Mapa;
