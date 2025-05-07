
import React from 'react';

export default function AuthSetupInstructions() {
  return (
    <div className="text-sm border p-3 rounded-md bg-gray-50">
      <p className="font-semibold">Acesso restrito:</p>
      <ol className="list-decimal text-left mx-4 mt-2 space-y-1 text-xs">
        <li>Apenas dois e-mails têm permissão para acessar esta área</li>
        <li>leandro@dharmaimoveis.com.br (Usuário Master)</li>
        <li>admin@dharmaimoveis.com.br (Usuário Autorizado)</li>
      </ol>
    </div>
  );
}
