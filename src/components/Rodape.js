import React from "react";

export default function Rodape() {
  return (
    <footer>
      <div className="pager-inner-content">
        <div className="download-options">
          <p>Está com dúvida? Entre em contato com Suporte</p>
          {/* Link para o WhatsApp */}
        <a
          href="https://api.whatsapp.com/send?phone=62996891421&text=Preciso%20de%20suporte"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/whatsapp.png" alt="WhatsApp" />
        </a>  
          <p>Nos siga no Instagram e fique por dentro das novidades</p>
                   {/* Link para o Instagram */}
        <a
          href="https://www.instagram.com/estoquemedgo/?igsh=MW0weW9rbjdmaGRzdQ%3D%3D&utm_source=qr#/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/Instagram.png" alt="Instagram" />
        </a>
        </div>

        <div>
          <div className="logo-footer">
          <h1 className="logo1">
           <span>ESTOQUE MED</span>
            </h1>
            <p>
            Agradecemos pela confiança em nossa distribuidora, a Estoque Med.
            É uma honra fazer parte da sua jornada, contribuindo para o sucesso de sua empresa e para a qualidade do atendimento prestado. 
            Sabemos da importância de contar com produtos de excelência para garantir eficiência e segurança no dia a dia.
            Com um compromisso contínuo com a inovação e a qualidade, estamos sempre prontos para atender às suas necessidades e oferecer o melhor suporte.
            Conte conosco como seu parceiro de confiança para fornecer produtos de alta qualidade e um atendimento dedicado.
            Obrigado por fazer parte da nossa trajetória!
            </p>
            </div>
            <hr/>
            <p className="copyright">
             Copyright 2030 - ESTOQUE MED - Todos Direitos Reservados 
            </p>
        </div>
      </div>
    </footer>
  );
}
