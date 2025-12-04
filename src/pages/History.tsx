import React, { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp } from 'lucide-react';
import { useSerres } from '../hooks/useSerres';

const History: React.FC = () => {
  const { getCurrentSerre, serres, selectedSerre, setSelectedSerre } = useSerres();
  const [selectedSensor, setSelectedSensor] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

  const currentSerre = getCurrentSerre();

  if (!currentSerre) {
    return <div className="p-6">Aucune serre sélectionnée</div>;
  }

  // Simulation de données historiques
  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toISOString(),
        temperature: 20 + Math.random() * 10,
        humidity_air: 60 + Math.random() * 20,
        humidity_soil: 40 + Math.random() * 30,
        ph: 6.5 + Math.random() * 1,
        light: 400 + Math.random() * 600
      });
    }
    return data;
  };

  const historicalData = generateHistoricalData();

  const exportData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csv = [
        'Timestamp,Temperature,Humidity Air,Humidity Soil,pH,Light',
        ...historicalData.map(d => 
          `${d.time},${d.temperature.toFixed(1)},${d.humidity_air.toFixed(1)},${d.humidity_soil.toFixed(1)},${d.ph.toFixed(1)},${d.light.toFixed(0)}`
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historique_${currentSerre.name}_${timeRange}.csv`;
      a.click();
    }
  };

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des données</h1>
            <p className="text-gray-600">Analyse des tendances et évolution des paramètres</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Serre</label>
            <select
              value={selectedSerre}
              onChange={(e) => setSelectedSerre(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {serres.map(serre => (
                <option key={serre.id} value={serre.id}>{serre.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capteur</label>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Tous les capteurs</option>
              {currentSerre.sensors.map(sensor => (
                <option key={sensor.id} value={sensor.type}>{sensor.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Affichage</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as 'chart' | 'table')}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="chart">Graphique</option>
              <option value="table">Tableau</option>
            </select>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      {viewType === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {['temperature', 'humidity_air', 'humidity_soil', 'ph', 'light'].map((sensorType) => {
            if (selectedSensor !== 'all' && selectedSensor !== sensorType) return null;
            
            const sensor = currentSerre.sensors.find(s => s.type === sensorType);
            if (!sensor) return null;
            
            return (
              <div key={sensorType} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <TrendingUp size={16} />
                    <span>Tendance stable</span>
                  </div>
                </div>
                
                {/* Graphique simplifié */}
                <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-center space-x-1 p-4">
                  {historicalData.slice(-20).map((point, index) => {
                    const value = point[sensorType as keyof typeof point] as number;
                    const maxValue = Math.max(...historicalData.map(d => d[sensorType as keyof typeof d] as number));
                    const height = (value / maxValue) * 100;
                    
                    return (
                      <div
                        key={index}
                        className="bg-green-500 rounded-t w-2 opacity-75 hover:opacity-100 transition-opacity"
                        style={{
                          height: `${height}%`,
                          minHeight: '8px'
                        }}
                        title={`${value.toFixed(1)} ${sensor.unit}`}
                      />
                    );
                  })}
                </div>
                
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Min: {Math.min(...historicalData.map(d => d[sensorType as keyof typeof d] as number)).toFixed(1)} {sensor.unit}</span>
                  <span>Moy: {(historicalData.reduce((sum, d) => sum + (d[sensorType as keyof typeof d] as number), 0) / historicalData.length).toFixed(1)} {sensor.unit}</span>
                  <span>Max: {Math.max(...historicalData.map(d => d[sensorType as keyof typeof d] as number)).toFixed(1)} {sensor.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vue tableau */}
      {viewType === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horodatage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Température (°C)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidité Air (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidité Sol (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    pH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Luminosité (lux)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historicalData.slice(-10).reverse().map((point, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(point.time).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.temperature.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.humidity_air.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.humidity_soil.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.ph.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.light.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;