import React from 'react';
import { Thermometer, Droplets, Beaker, Sun, Wifi, WifiOff } from 'lucide-react';
import { Sensor } from '../types';

interface SensorCardProps {
  sensor: Sensor;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const getIcon = () => {
    switch (sensor.type) {
      case 'temperature':
        return <Thermometer size={24} />;
      case 'humidity_air':
      case 'humidity_soil':
        return <Droplets size={24} />;
      case 'ph':
        return <Beaker size={24} />;
      case 'light':
        return <Sun size={24} />;
      default:
        return <Wifi size={24} />;
    }
  };

  const getStatusColor = () => {
    switch (sensor.status) {
      case 'ok':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (sensor.status) {
      case 'ok':
        return 'Normal';
      case 'warning':
        return 'Attention';
      case 'critical':
        return 'Critique';
      default:
        return 'Inconnu';
    }
  };

  const isOnline = Date.now() - sensor.lastUpdate.getTime() < 300000; // 5 minutes

  return (
    <div className={`bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi size={12} className="text-green-500" />
              ) : (
                <WifiOff size={12} className="text-red-500" />
              )}
              <span className="text-xs text-gray-500">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {sensor.value}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {sensor.unit}
            </span>
          </div>
          {/* Mini sparkline placeholder */}
          <div className="flex items-end space-x-1 h-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full opacity-40 ${getStatusColor()}`}
                style={{
                  height: `${Math.random() * 100 + 20}%`
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Dernière mise à jour: {sensor.lastUpdate.toLocaleTimeString('fr-FR')}
        </div>
      </div>
    </div>
  );
};

export default SensorCard;