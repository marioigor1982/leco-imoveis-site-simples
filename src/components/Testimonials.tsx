
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  content: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Brenda",
      content: "Leandro muito obrigada por tudo, você foi muito importante nesse processo, eu tive contato com outros corretores mais você foi excelente, obrigada pela paciência, eu estou muito feliz, porque estou realizando um sonho, te agradeço de coração, que Deus abençoe sua vida grandiosamente."
    },
    {
      name: "Elaine",
      content: "Obrigada mesmo nós estamos super felizes e vc com certeza vai longe seu tratamento é diferenciado, muito solicito e deixou tudo muito claro pra nós fez toda a diferença."
    },
    {
      name: "Cristiano",
      content: "Irmão, se você tivesse nos atendido mal, jamais indicaríamos, ainda mais pra alguém da família. O mérito é teu. Ficamos muito felizes também por eles. Depois a gente marca um café por tua conta hahahaha..."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#253342] mb-12">
          O que meus clientes dizem
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 right-4 text-[#5e9188] opacity-20 w-12 h-12" />
                <p className="text-gray-600 italic mb-6 relative z-10">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#5e9188] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-[#253342]">Cliente {testimonial.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
