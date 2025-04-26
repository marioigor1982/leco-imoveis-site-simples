
import React, { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          InlineLayout: {
            HORIZONTAL: number;
          };
          new (config: any, element: string): any;
        };
      };
    };
  }
}

export const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate Script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,es,en,ja',
        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
      }, 'google_translate_element');
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="google_translate_element" className="ml-4"></div>;
};
