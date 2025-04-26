
import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Smartphone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#232226] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <div className="flex flex-col space-y-2">
              <a 
                href="https://wa.me/5511991866739" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#5e9188] transition-colors"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Celular: (11) 99186-6739
              </a>
              <a 
                href="https://www.instagram.com/lecocorretor/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#5e9188] transition-colors"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram: @lecocorretor
              </a>
              <a 
                href="https://www.facebook.com/corretorleco" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#5e9188] transition-colors"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Facebook: corretorleco
              </a>
              <a 
                href="https://www.linkedin.com/in/leandro-buscarioli-3084a52b8?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BgbIs9SraTtuwxFzUiT%2Bq7g%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#5e9188] transition-colors"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn: Leandro Buscarioli
              </a>
              <a 
                href="mailto:consultorimobiliarioleco@gmail.com" 
                className="flex items-center hover:text-[#5e9188] transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                consultorimobiliarioleco@gmail.com
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Localização</h3>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.1345809995214!2d-46.58025!3d-23.673089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce43bcf659b807%3A0x9f77cd742a713ec9!2sR.%20Pacaembu%2C%20297%20-%20Paulic%C3%A9ia%2C%20S%C3%A3o%20Bernardo%20do%20Campo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1620140518789!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy"
              className="rounded-lg"
            ></iframe>
            <p className="mt-2 text-sm">
              Rua Pacaembu, 297 - Bairro Pauliceia, São Bernardo do Campo, SP, CEP 09692-040, Brasil
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#3e5954] text-center text-sm">
          <p>© {new Date().getFullYear()} Leandro Buscarioli Colares | CRECI-SP 283775F</p>
        </div>
      </div>
    </footer>
  );
};
