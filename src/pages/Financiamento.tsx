
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Financiamento() {
  const bancos = [
    {
      nome: "Caixa Econômica Federal",
      logo: "/lovable-uploads/5cd14779-cfd8-48ef-b5b4-b710f606f6a9.png",
      link: "https://habitacao.caixa.gov.br/siopiweb-web/simulaOperacaoInternet.do?method=inicializarCasoUso"
    },
    {
      nome: "Banco do Brasil",
      logo: "/lovable-uploads/5cd14779-cfd8-48ef-b5b4-b710f606f6a9.png",
      link: "https://www.bb.com.br/site/pra-voce/financiamentos/financiamento-imobiliario/"
    },
    {
      nome: "Itaú",
      logo: "https://logodownload.org/wp-content/uploads/2014/05/itau-logo-1.png",
      link: "https://credito-imobiliario.itau.com.br/"
    },
    {
      nome: "Bradesco",
      logo: "/lovable-uploads/5cd14779-cfd8-48ef-b5b4-b710f606f6a9.png",
      link: "https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/encontre-seu-credito/simuladores-imoveis.shtm"
    },
    {
      nome: "Santander",
      logo: "https://logodownload.org/wp-content/uploads/2014/09/santander-logo-2.png",
      link: "https://www.santander.com.br/atendimento-para-voce/simuladores/simulador-credito-imobiliário"
    },
    {
      nome: "Creditas",
      logo: "https://www.creditas.com/wp-content/themes/creditas-theme/static/images/creditas-logo.svg",
      link: "https://www.creditas.com/imoveis/financiamento-imobiliario"
    },
    {
      nome: "Sicoob",
      logo: "https://www.sicoob.com.br/documents/44259/0/logo-sicoob.svg",
      link: "https://www.sicoob.com.br/web/sicoob/credito-imobiliario"
    },
    {
      nome: "Banco Inter",
      logo: "https://logodownload.org/wp-content/uploads/2018/01/banco-inter-logo.png",
      link: "https://www.bancointer.com.br/credito/credito-imobiliario/"
    },
  ];

  const vantagens = [
    {
      titulo: "Diversas opções de financiamento",
      descricao: "Compare taxas, prazos e condições de diferentes bancos para escolher a melhor opção."
    },
    {
      titulo: "Consultoria especializada",
      descricao: "Receba orientação profissional para escolher o tipo de financiamento mais adequado ao seu perfil."
    },
    {
      titulo: "Acompanhamento completo",
      descricao: "Assistência em todas as etapas do processo, desde a simulação até a assinatura do contrato."
    },
    {
      titulo: "Melhores condições",
      descricao: "Condições especiais e negociação das melhores taxas para você."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#253342] mb-4">
            Simule seu Financiamento
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Compare as opções disponíveis nos principais bancos e escolha a melhor para realizar o seu sonho da casa própria.
            Entre em contato para receber orientação especializada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {vantagens.map((vantagem, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-[#5e9188]">
                  {vantagem.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {vantagem.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#253342] mb-8">
          Escolha um banco para simular
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bancos.map((banco, index) => (
            <a 
              key={index}
              href={banco.link}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center"
            >
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src={banco.logo} 
                  alt={banco.nome}
                  className="max-h-20 max-w-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#253342] mb-2 text-center">
                {banco.nome}
              </h3>
              <div className="mt-4 inline-flex items-center text-[#5e9188] font-medium">
                Simular agora
                <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-xl font-semibold text-[#253342] mb-4">
            Precisa de ajuda para escolher a melhor opção?
          </h3>
          <a 
            href="https://wa.me/5511991866739" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#5e9188] hover:bg-[#3e5954] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Fale comigo no WhatsApp
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
