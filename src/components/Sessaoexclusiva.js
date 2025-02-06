import { Link, useNavigate } from "react-router-dom";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { usePesquisa } from "./PesquisaContext";

export default function SessaoExclusiva() {
  const { setSearchTerm } = usePesquisa();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3600); // Contagem regressiva de 1 hora (em segundos)

  const handleVerAgoraClick = () => {
    setSearchTerm("luva de vinil p");
    navigate("/Produto");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="sessao-exclusiva">
      <div className="page-inner-content">
        <div className="content">
          <div className="left-side">
            <h2>Promoção do dia!</h2>
            <p>"Imperdível! Não perca essa oferta"</p>
            <p>Tempo restante: {formatCountdown()}</p>
            <Link to="#" onClick={handleVerAgoraClick} className="btnveragora1">
              <span>Ver Agora</span>
              <FontAwesomeIcon icon={faChevronCircleRight} />
            </Link>
          </div>
          <div className="right-side">
            <img src="/images/Exclusive4.png" alt="NÃO PERCA" />
          </div>
        </div>
      </div>
    </div>
  );
}
