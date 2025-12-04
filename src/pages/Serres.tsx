import React, { useState } from 'react';
import { Plus, MapPin, Settings, Trash2, Edit, Users, Activity } from 'lucide-react';
import { useSerres } from '../hooks/useSerres';
import { Serre } from '../types';

const Serres: React.FC = () => {
  const { serres, selectedSerre, setSelectedSerre } = useSerres();
  const [showAddSerre, setShowAddSerre] = useState(false);
  const [editingSerre, setEditingSerre] = useState<string | null>(null);
  const [newSerre, setNewSerre] = useState({
    name: '',
    location: '',
    coordinates: { lat: '', lng: '' }
  });

  const handleAddSerre = () => {
    // Simulation d'ajout de serre
    console.log('Ajout serre:', newSerre);
    setShowAddSerre(false);
    setNewSerre({ name: '', location: '', coordinates: { lat: '', lng: '' } });
  };

  const getSerreStatus = (serre: Serre) => {
    const criticalSensors = serre.sensors.filter(s => s.status === 'critical').length;
    const warningSensors = serre.sensors.filter(s => s.status === 'warning').length;
    
    if (criticalSensors > 0) return { status: 'critical', text: 'Critique', color: 'bg-red-100 text-red-800 border-red-200' };
    if (warningSensors > 0) return { status: 'warning', text: 'Attention', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { status: 'ok', text: 'Normal', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Serres</h1>
            <p className="text-gray-600">Gérez vos installations et suivez leurs performances</p>
          </div>
          
          <button
            onClick={() => setShowAddSerre(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={16} />
            <span>Ajouter une Serre</span>
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Serres</p>
              <p className="text-2xl font-bold text-gray-900">{serres.length}</p>
            </div>
            <MapPin className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capteurs</p>
              <p className="text-2xl font-bold text-blue-600">
                {serres.reduce((total, serre) => total + serre.sensors.length, 0)}
              </p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Équipements</p>
              <p className="text-2xl font-bold text-purple-600">
                {serres.reduce((total, serre) => total + serre.equipment.length, 0)}
              </p>
            </div>
            <Settings className="text-purple-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertes</p>
              <p className="text-2xl font-bold text-red-600">
                {serres.reduce((total, serre) => 
                  total + serre.sensors.filter(s => s.status !== 'ok').length, 0
                )}
              </p>
            </div>
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des serres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {serres.map(serre => {
          const status = getSerreStatus(serre);
          const activeEquipment = serre.equipment.filter(e => e.isActive).length;
          const isSelected = selectedSerre === serre.id;
          
          return (
            <div
              key={serre.id}
              className={`bg-white rounded-xl border-2 p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedSerre(serre.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{serre.name}</h3>
                    {isSelected && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Sélectionnée
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin size={16} />
                    <span>{serre.location}</span>
                  </div>
                  {serre.coordinates && (
                    <p className="text-sm text-gray-500">
                      {serre.coordinates.lat.toFixed(4)}, {serre.coordinates.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                    {status.text}
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{serre.sensors.length}</p>
                  <p className="text-sm text-gray-600">Capteurs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{serre.equipment.length}</p>
                  <p className="text-sm text-gray-600">Équipements</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{activeEquipment}</p>
                  <p className="text-sm text-gray-600">Actifs</p>
                </div>
              </div>

              {/* Aperçu des capteurs */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Capteurs principaux</h4>
                <div className="grid grid-cols-2 gap-2">
                  {serre.sensors.slice(0, 4).map(sensor => (
                    <div key={sensor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{sensor.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{sensor.value}</span>
                        <span className="text-xs text-gray-500">{sensor.unit}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          sensor.status === 'ok' ? 'bg-green-500' :
                          sensor.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'ajout de serre */}
      {showAddSerre && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une nouvelle serre</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la serre</label>
                <input
                  type="text"
                  value={newSerre.name}
                  onChange={(e) => setNewSerre(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ex: Serre Tomates Bio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                <input
                  type="text"
                  value={newSerre.location}
                  onChange={(e) => setNewSerre(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ex: Zone Nord"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newSerre.coordinates.lat}
                    onChange={(e) => setNewSerre(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lat: e.target.value }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="46.2276"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newSerre.coordinates.lng}
                    onChange={(e) => setNewSerre(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lng: e.target.value }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="2.2137"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddSerre(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSerre}
                disabled={!newSerre.name || !newSerre.location}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Serres;