
import BackgroundSlideshow from '@/components/BackgroundSlideshow';
import PropertiesShowcase from '@/components/PropertiesShowcase';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center text-white">
        <BackgroundSlideshow />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            O sonho da casa própria nunca foi tão fácil de realizar!
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Especialista em imóveis na região do ABC Paulista
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/5511991866739"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#5e9188] hover:bg-[#253342] text-white font-medium px-8 py-4 rounded-lg transition-colors"
            >
              Fale Comigo
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <Link
              to="/login"
              className="inline-flex items-center bg-[#253342] hover:bg-[#5e9188] text-white font-medium px-8 py-4 rounded-lg transition-colors"
            >
              Área do Corretor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Properties Showcase Section */}
      <PropertiesShowcase />
    </div>
  );
}
