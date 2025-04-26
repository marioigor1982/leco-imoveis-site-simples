
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { GoogleTranslate } from "./GoogleTranslate";

interface HeaderProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  visitas: number;
}

export const Header = ({ scrolled, isMenuOpen, toggleMenu, visitas }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-[#1A1F2C]'}`}>
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
            <GoogleTranslate />
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
              onClick={() => toggleMenu()}
            >
              Home
            </Link>
            <Link 
              to="/sobre" 
              className={`font-medium hover:text-[#5e9188] transition-colors ${location.pathname === '/sobre' ? 'text-[#5e9188]' : 'text-blue-900'}`}
              onClick={() => toggleMenu()}
            >
              Sobre Mim
            </Link>
            <Link 
              to="/financiamento" 
              className={`font-medium hover:text-[#5e9188] transition-colors ${location.pathname === '/financiamento' ? 'text-[#5e9188]' : 'text-blue-900'}`}
              onClick={() => toggleMenu()}
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
  );
};
