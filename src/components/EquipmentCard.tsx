import React from 'react';
import { 
  Droplets, 
  Fan, 
  Lightbulb, 
  Thermometer,
  Snowflake,
  Power,
  PowerOff
} from 'lucide-react';
import { Equipment } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
  onToggle: (id: string) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onToggle }) => {
  const getIcon = () => {
    switch (equipment.type) {
      case 'pump':
        return <Droplets size={24} />;
      case 'fan':
        return <Fan size={24} />;
      case 'light':
        return <Lightbulb size={24} />;
      case 'heater':
        return <Thermometer size={24} />;
      case 'cooling':
        return <Snowflake size={24} />;
      default:
        return <Power size={24} />;
    }
  };

  const getTypeName = () => {
    switch (equipment.type) {
      case 'pump':
        return 'Pompe';
      case 'fan':
        return 'Ventilateur';
      case 'light':
        return 'Éclairage';
      case 'heater':
        return 'Chauffage';
      case 'cooling':
        return 'Refroidissement';
      default:
        return 'Équipement';
    }
  };

  const timeSinceLastAction = Math.floor((Date.now() - equipment.lastAction.getTime()) / 60000);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            equipment.isActive 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
            <p className="text-sm text-gray-500">{getTypeName()}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          equipment.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {equipment.isActive ? 'Actif' : 'Inactif'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Dernière action: il y a {timeSinceLastAction}min
        </div>
        
        <button
          onClick={() => onToggle(equipment.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            equipment.isActive
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {equipment.isActive ? (
            <>
              <PowerOff size={16} />
              <span>Arrêter</span>
            </>
          ) : (
            <>
              <Power size={16} />
              <span>Démarrer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;