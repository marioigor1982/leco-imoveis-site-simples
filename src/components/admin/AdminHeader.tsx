
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

type AdminHeaderProps = {
  currentDateTime: Date;
  onSignOut: () => void;
  formatDateTime: (date: Date) => string;
};

const AdminHeader = ({ currentDateTime, onSignOut, formatDateTime }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={18} />
              Voltar ao site
            </Button>
          </Link>
        </div>
        <div className="text-right text-sm text-gray-600">
          {formatDateTime(currentDateTime)}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#253342]">
          Painel do Corretor
        </h1>
        <Button
          onClick={onSignOut}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
