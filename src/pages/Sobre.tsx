
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              src="/lovable-uploads/5cd14779-cfd8-48ef-b5b4-b710f606f6a9.png"
              alt="Leandro Buscarioli Colares" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#253342] mb-6">
              Leandro Buscarioli Colares
            </h1>
            <p className="text-lg text-[#5e9188] font-semibold mb-4">
              CRECI-SP 283775F
            </p>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                Sou Leandro Buscarioli Colares, corretor de imóveis atuante na região da Grande São Paulo e ABC. Minha missão é facilitar a realização do sonho da casa própria para meus clientes, com um atendimento personalizado e diferenciado.
              </p>
              <p className="mb-4 text-gray-700">
                Meu diferencial está na consultoria completa que ofereço, sempre pronto para responder dúvidas e auxiliar em todas as etapas do processo de compra, venda ou locação de imóveis.
              </p>
              <p className="mb-4 text-gray-700">
                Acredito que cada cliente é único, por isso trabalho para entender suas necessidades específicas e oferecer as melhores condições para que possam realizar o sonho de ter uma casa que possam chamar de "sua".
              </p>
              <p className="mb-4 text-gray-700">
                Com conhecimento do mercado local e dedicação ao atendimento, meu compromisso é proporcionar uma experiência tranquila e segura em todos os aspectos da negociação imobiliária.
              </p>
            </div>
            <div className="mt-6">
              <a 
                href="https://wa.me/5511991866739" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#5e9188] hover:bg-[#3e5954] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Entre em contato
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#253342] mb-8">
          Por que escolher meus serviços?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#5e9188] text-white flex items-center justify-center mb-4 text-xl font-bold">1</div>
            <h3 className="text-xl font-semibold text-[#253342] mb-2">Atendimento Personalizado</h3>
            <p className="text-gray-600">Dedico tempo para entender suas necessidades específicas e encontrar o imóvel perfeito para você.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#5e9188] text-white flex items-center justify-center mb-4 text-xl font-bold">2</div>
            <h3 className="text-xl font-semibold text-[#253342] mb-2">Conhecimento Local</h3>
            <p className="text-gray-600">Amplo conhecimento do mercado imobiliário na região do ABC e Grande São Paulo.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#5e9188] text-white flex items-center justify-center mb-4 text-xl font-bold">3</div>
            <h3 className="text-xl font-semibold text-[#253342] mb-2">Condições Especiais</h3>
            <p className="text-gray-600">Trabalho para oferecer as melhores condições de negociação e financiamento para meus clientes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
