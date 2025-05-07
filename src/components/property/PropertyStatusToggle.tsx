
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heart } from 'lucide-react';

type PropertyStatusToggleProps = {
  sold: boolean;
  onSoldChange: (checked: boolean) => void;
  likes: number;
};

const PropertyStatusToggle = ({ sold, onSoldChange, likes }: PropertyStatusToggleProps) => {
  return (
    <div className="space-y-2 flex items-center">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="sold">Marcar como vendido</Label>
        <div className="flex items-center space-x-2">
          <Switch 
            id="sold" 
            checked={sold} 
            onCheckedChange={onSoldChange}
          />
          <span className={sold ? 'text-green-600 font-medium' : 'text-gray-500'}>
            {sold ? 'VENDIDO' : 'DISPONÍVEL'}
          </span>
        </div>
      </div>
      <div className="flex items-center ml-8">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-gray-700 font-medium">
            {likes || 0} curtidas
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyStatusToggle;
