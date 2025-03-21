import { faBoxOpen, faBriefcaseMedical, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function SobreNos() {
  return (
    <div className="sobre-nos">
      {/* Texto principal */}
      <div className="texto-sobre-nos">
        <h1>Quem Somos</h1>
        <p>
        Nascemos em 2021 e carregamos como missão proporcionar saúde por meio dos nossos itens hospitalares.
        Estamos localizados em Goiânia-GO e também contamos com uma extensão de nós em Palmas-TO.
        </p>
        
         {/* Atendimento */}
      <div>
        <h2 className="Atentimento"><FontAwesomeIcon icon={faStar} className="icone" />Atendimento </h2>
        <p className="text-lg text-gray-700">
          Na nossa empresa, o atendimento ao cliente vai além do esperado. Priorizamos um serviço personalizado,
          com atenção especial a cada detalhe, garantindo que você se sinta valorizado.
          Nossa equipe sempre está pronta para oferecer soluções rápidas e eficientes.
        </p>
      </div>

       {/* Entregas */}
       <div>
        
        <h2 className="Entrega"><FontAwesomeIcon icon={faBoxOpen} className="icone" /> Entregas</h2>
        <p className="text-lg text-gray-700">
          Aqui, a sua satisfação é a nossa prioridade! Oferecemos entregas rápidas e eficientes, garantindo
          que seu pedido chegue no prazo e em perfeitas condições. Com um processo de logística otimizado
          e um time comprometido com a excelência.
        </p>
      </div>

        {/* Lista de Diferenciais */}
        <ul className="diferenciais">
        <h2 className="diferencia-texto"><FontAwesomeIcon icon={faBriefcaseMedical} className="icone" /> Nossos Diferenciais</h2>
          <li><strong>Materiais de alta qualidade</strong></li>
          <li><strong>Entrega rápida e segura</strong></li>
          <li><strong>Atendimento especializado</strong></li>
          <li><strong>Parcerias confiáveis</strong></li>
        </ul>
      </div>

      {/* Informações adicionais */}
      <div className="informacoes-adicionais">
        <p>
          📍 <strong>Endereço:</strong> Av. Vieira Santos - Residencial Itaipú, Goiânia - GO, 74356-048
        </p>
        <p>
          🏢 <strong>Empresa:</strong> ESTOQUE MED
        </p>
      </div>

      {/* Botão para WhatsApp */}
      <div className="whatsapp-container">
        <a 
          href="https://api.whatsapp.com/send/?phone=556282824923&text=Olá,+gostaria+de+saber+mais+sobre+os+materiais+hospitalares!&type=phone_number&app_absent=0" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          Fale conosco no WhatsApp
        </a>
      </div>
    </div>
  );
}
