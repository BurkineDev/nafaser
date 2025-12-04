import React, { useState } from 'react';
import { Activity, Clock, History } from 'lucide-react';
import EquipmentCard from '../components/EquipmentCard';
import { useSerres } from '../hooks/useSerres';

const Control: React.FC = () => {
  const { getCurrentSerre, serres, selectedSerre, setSelectedSerre, toggleEquipment } = useSerres();
  const [actionHistory, setActionHistory] = useState([
    {
      id: '1',
      equipmentId: 'e2',
      equipmentName: 'Ventilateur',
      action: 'Activé',
      timestamp: new Date(Date.now() - 1800000),
      user: 'Manuel'
    },
    {
      id: '2',
      equipmentId: 'e1',
      equipmentName: 'Pompe Irrigation',
      action: 'Désactivé',
      timestamp: new Date(Date.now() - 3600000),
      user: 'Automatique'
    },
    {
      id: '3',
      equipmentId: 'e3',
      equipmentName: 'Éclairage LED',
      action: 'Activé',
      timestamp: new Date(Date.now() - 7200000),
      user: 'Manuel'
    }
  ]);

  const currentSerre = getCurrentSerre();

  const handleEquipmentToggle = (equipmentId: string) => {
    toggleEquipment(equipmentId);
    
    const equipment = currentSerre?.equipment.find(e => e.id === equipmentId);
    if (equipment) {
      const newAction = {
        id: Date.now().toString(),
        equipmentId,
        equipmentName: equipment.name,
        action: equipment.isActive ? 'Désactivé' : 'Activé',
        timestamp: new Date(),
        user: 'Manuel'
      };
      setActionHistory(prev => [newAction, ...prev.slice(0, 9)]);
    }
  };

  if (!currentSerre) {
    return <div className="p-6">Aucune serre sélectionnée</div>;
  }

  const activeEquipment = currentSerre.equipment.filter(e => e.isActive).length;
  const totalPower = activeEquipment * 150; // Simulation consommation

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Contrôle Manuel</h1>
            <p className="text-gray-600">Gérez manuellement les équipements de {currentSerre.name}</p>
          </div>
          
          <select
            value={selectedSerre}
            onChange={(e) => setSelectedSerre(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            {serres.map(serre => (
              <option key={serre.id} value={serre.id}>{serre.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Équipements actifs</p>
              <p className="text-2xl font-bold text-green-600">{activeEquipment}</p>
            </div>
            <Activity className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consommation</p>
              <p className="text-2xl font-bold text-blue-600">{totalPower}W</p>
            </div>
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps de fonctionnement</p>
              <p className="text-2xl font-bold text-purple-600">4h 32min</p>
            </div>
            <Clock className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Contrôles des équipements */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Équipements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSerre.equipment.map(equipment => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
              onToggle={handleEquipmentToggle}
            />
          ))}
        </div>
      </div>

      {/* Planification rapide */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions programmées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-900">Irrigation matinale</h4>
              <span className="text-sm text-green-600">06:00</span>
            </div>
            <p className="text-sm text-green-700">Activation pompe - 15 minutes</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900">Éclairage nocturne</h4>
              <span className="text-sm text-blue-600">22:00</span>
            </div>
            <p className="text-sm text-blue-700">Activation LED - 8 heures</p>
          </div>
        </div>
      </div>

      {/* Historique des actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <History size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Historique des actions</h3>
        </div>
        
        <div className="space-y-3">
          {actionHistory.slice(0, 8).map(action => (
            <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{action.equipmentName}</p>
                <p className="text-sm text-gray-600">
                  {action.action} • {action.user}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {action.timestamp.toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-gray-500">
                  {action.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Control;