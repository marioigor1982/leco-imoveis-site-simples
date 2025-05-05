
import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { ThemeProvider } from "@/components/theme-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visitas, setVisitas] = useState(0);

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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <style>
          {`
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
          `}
        </style>

        <Header 
          scrolled={scrolled}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          visitas={visitas}
        />
        
        <main className="flex-grow pt-16">
          {children}
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
