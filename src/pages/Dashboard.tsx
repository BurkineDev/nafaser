import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Wifi, Activity, MapPin } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import EquipmentCard from '../components/EquipmentCard';
import { useSerres } from '../hooks/useSerres';

const Dashboard: React.FC = () => {
  const { getCurrentSerre, serres, selectedSerre, setSelectedSerre, loading, toggleEquipment } = useSerres();
  
  const currentSerre = getCurrentSerre();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!currentSerre) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune serre sélectionnée</h3>
          <p className="text-gray-500">Veuillez sélectionner une serre pour voir les données.</p>
        </div>
      </div>
    );
  }

  const getOverallStatus = () => {
    const criticalSensors = currentSerre.sensors.filter(s => s.status === 'critical').length;
    const warningSensors = currentSerre.sensors.filter(s => s.status === 'warning').length;
    
    if (criticalSensors > 0) return { status: 'critical', text: 'Critique', color: 'text-red-600 bg-red-50 border-red-200' };
    if (warningSensors > 0) return { status: 'warning', text: 'Attention', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { status: 'ok', text: 'Normal', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  const overallStatus = getOverallStatus();
  const activeEquipment = currentSerre.equipment.filter(e => e.isActive).length;

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header avec sélection de serre */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin size={20} className="text-green-600" />
              <select
                value={selectedSerre}
                onChange={(e) => setSelectedSerre(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none cursor-pointer text-gray-900"
              >
                {serres.map(serre => (
                  <option key={serre.id} value={serre.id}>{serre.name}</option>
                ))}
              </select>
            </div>
            <p className="text-gray-600">{currentSerre.location}</p>
            <p className="text-sm text-gray-500">
              {currentSerre.sensors.length} capteurs • {currentSerre.equipment.length} équipements
            </p>
          </div>
          
          <div className="flex flex-col md:items-end space-y-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${overallStatus.color}`}>
              <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
              {overallStatus.text}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Wifi size={16} className="text-green-500" />
                <span>MQTT Connecté</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity size={16} className="text-blue-500" />
                <span>{activeEquipment} actifs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Température</p>
              <p className="text-xl font-bold text-gray-900">
                {currentSerre.sensors.find(s => s.type === 'temperature')?.value || '--'}°C
              </p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Humidité</p>
              <p className="text-xl font-bold text-gray-900">
                {currentSerre.sensors.find(s => s.type === 'humidity_air')?.value || '--'}%
              </p>
            </div>
            <TrendingDown className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">pH Sol</p>
              <p className="text-xl font-bold text-gray-900">
                {currentSerre.sensors.find(s => s.type === 'ph')?.value || '--'}
              </p>
            </div>
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Luminosité</p>
              <p className="text-xl font-bold text-gray-900">
                {currentSerre.sensors.find(s => s.type === 'light')?.value || '--'} lux
              </p>
            </div>
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Capteurs */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Capteurs en temps réel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSerre.sensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>

      {/* Équipements */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contrôle des équipements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSerre.equipment.map(equipment => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
              onToggle={toggleEquipment}
            />
          ))}
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes récentes</h3>
        <div className="space-y-3">
          {currentSerre.sensors
            .filter(sensor => sensor.status !== 'ok')
            .map(sensor => (
              <div key={sensor.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                sensor.status === 'critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    sensor.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{sensor.name}</p>
                    <p className="text-sm text-gray-600">
                      Valeur actuelle: {sensor.value} {sensor.unit}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  sensor.status === 'critical' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {sensor.status === 'critical' ? 'Critique' : 'Attention'}
                </span>
              </div>
            ))}
          
          {currentSerre.sensors.every(s => s.status === 'ok') && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Aucune alerte active</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;