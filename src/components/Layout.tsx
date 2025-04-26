import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Facebook, Instagram, Linkedin, Mail, Smartphone } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visitas, setVisitas] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Contador de visitas
    const visitCount = localStorage.getItem('visitCount') || '0';
    const newCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', newCount.toString());
    setVisitas(newCount);

    // Add Google Translate Script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = function() {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,es,en,ja',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL
      }, 'google_translate_element');
    };
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.removeChild(script);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style jsx global>{`
        :root {
          --color-white: #ffffff;
          --color-teal-light: #5e9188;
          --color-teal-dark: #3e5954;
          --color-navy: #253342;
          --color-dark: #232226;
        }
        .goog-te-gadget {
          color: transparent !important;
        }
        .goog-te-gadget .goog-te-combo {
          color: black;
          border-radius: 4px;
          padding: 2px;
          border: 1px solid #ccc;
        }
        .VIpgJd-ZVi9od-l4eHX-hSRGPd {
          display: none;
        }
      `}</style>

      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/5cd14779-cfd8-48ef-b5b4-b710f606f6a9.png" 
              alt="Leandro Corretor"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#5e9188]"
            />
          </Link>
          
          <div className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/" 
              className={`font-medium hover:text-[#5e9188] transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/sobre" 
              className={`font-medium hover:text-[#5e9188] transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              Sobre Mim
            </Link>
            <Link 
              to="/financiamento" 
              className={`font-medium hover:text-[#5e9188] transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              Financiamento
            </Link>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${scrolled ? 'text-gray-700' : 'text-white/80'}`}>
                Visitas: {visitas}
              </span>
              <div id="google_translate_element" className="ml-4"></div>
            </div>
          </div>
          
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? 
              <X className="w-6 h-6" /> : 
              <Menu className="w-6 h-6" />
            }
          </button>
        </div>
        
        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`font-medium hover:text-[#5e9188] transition-colors ${location.pathname === '/' ? 'text-[#5e9188]' : 'text-blue-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/sobre" 
                className={`font-medium hover:text-[#5e9188] transition-colors ${location.pathname === '/sobre' ? 'text-[#5e9188]' : 'text-blue-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Mim
              </Link>
              <Link 
                to="/financiamento" 
                className={`font-medium hover:text-[#5e9188] transition-colors ${location.pathname === '/financiamento' ? 'text-[#5e9188]' : 'text-blue-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Financiamento
              </Link>
              <div className="text-sm text-blue-700">
                Visitas: {visitas}
              </div>
              <div id="google_translate_element_mobile"></div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow pt-16">
        {children}
      </main>
      
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
      
      {/* Botão de WhatsApp flutuante */}
      <a
        href="https://wa.me/5511991866739"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
};

export default Layout;
