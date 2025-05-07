
import React from 'react';

export default function AuthSetupInstructions() {
  return (
    <div className="text-sm border p-3 rounded-md bg-gray-50">
      <p className="font-semibold">Configuração do login com Google:</p>
      <ol className="list-decimal text-left mx-4 mt-2 space-y-1 text-xs">
        <li>Acesse o dashboard do Supabase</li>
        <li>Vá para Authentication → Providers</li>
        <li>Habilite o provedor Google</li>
        <li>Configure as credenciais OAuth do Google</li>
        <li>Configure as URLs de redirecionamento em Authentication → URL Configuration</li>
      </ol>
    </div>
  );
}
