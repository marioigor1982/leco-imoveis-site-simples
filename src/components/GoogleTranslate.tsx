
import React, { useEffect } from 'react';
import { Languages, Globe } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    googleTranslateElementInit2: () => void;
    google: {
      translate: {
        TranslateElement: {
          InlineLayout: {
            HORIZONTAL: number;
            SIMPLE: number;
          };
          new (config: any, element: string): any;
        };
      };
    };
  }
}

interface GoogleTranslateProps {
  isMobile?: boolean;
}

export const GoogleTranslate = ({ isMobile = false }: GoogleTranslateProps) => {
  useEffect(() => {
    // Add Google Translate Script if it doesn't exist yet
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-script';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Google Translate
    if (isMobile) {
      window.googleTranslateElementInit2 = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'pt',
          includedLanguages: 'pt,en,ja,es,fr,it',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, 'google_translate_element_mobile');
      };
      
      // If script is already loaded, call the init function
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit2();
      }
    } else {
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'pt',
          includedLanguages: 'pt,en,ja,es,fr,it',
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          autoDisplay: false,
        }, 'google_translate_element');
      };
      
      // If script is already loaded, call the init function
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }
    
    return () => {
      // No need to remove the script on unmount as it needs to be globally available
    };
  }, [isMobile]);

  return (
    <div 
      id={isMobile ? "google_translate_element_mobile" : "google_translate_element"} 
      className={`flex items-center ${isMobile ? "mt-2" : "ml-4"} text-white`}
    >
      <Globe className="w-5 h-5 mr-1 text-white" />
      <span className="text-xs text-white">Traduzir</span>
    </div>
  );
};
