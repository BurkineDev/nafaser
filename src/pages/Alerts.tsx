import React, { useState } from 'react';
import { Bell, BellOff, Settings, Trash2, Check, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useSerres } from '../hooks/useSerres';
import { Alert } from '../types';

const Alerts: React.FC = () => {
  const { serres, selectedSerre, setSelectedSerre } = useSerres();
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning' | 'info'>('all');
  const [showSettings, setShowSettings] = useState(false);
  
  // Simulation d'alertes
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      serreId: '1',
      sensorId: 's2',
      message: 'Humidité de l\'air élevée (68%) - Risque de moisissures',
      severity: 'warning',
      timestamp: new Date(Date.now() - 1800000),
      acknowledged: false
    },
    {
      id: '2',
      serreId: '1',
      sensorId: 's1',
      message: 'Température critique (32°C) - Ventilation recommandée',
      severity: 'critical',
      timestamp: new Date(Date.now() - 3600000),
      acknowledged: false
    },
    {
      id: '3',
      serreId: '2',
      sensorId: 's6',
      message: 'Température optimale maintenue',
      severity: 'info',
      timestamp: new Date(Date.now() - 7200000),
      acknowledged: true
    },
    {
      id: '4',
      serreId: '1',
      sensorId: 's3',
      message: 'Humidité du sol faible (35%) - Irrigation requise',
      severity: 'warning',
      timestamp: new Date(Date.now() - 10800000),
      acknowledged: false
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    criticalOnly: false,
    quietHours: { start: '22:00', end: '07:00' }
  });

  const getAlertIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-orange-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getFilteredAlerts = () => {
    let filtered = alerts;
    
    if (selectedSerre && selectedSerre !== 'all') {
      filtered = filtered.filter(alert => alert.serreId === selectedSerre);
    }
    
    switch (filter) {
      case 'unread':
        return filtered.filter(alert => !alert.acknowledged);
      case 'critical':
        return filtered.filter(alert => alert.severity === 'critical');
      case 'warning':
        return filtered.filter(alert => alert.severity === 'warning');
      case 'info':
        return filtered.filter(alert => alert.severity === 'info');
      default:
        return filtered;
    }
  };

  const filteredAlerts = getFilteredAlerts();
  const unreadCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Alertes & Notifications</h1>
            <p className="text-gray-600">Surveillez les événements importants de vos serres</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings size={16} />
              <span>Paramètres</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {notificationSettings.push ? (
                <Bell className="text-green-500" size={20} />
              ) : (
                <BellOff className="text-gray-400" size={20} />
              )}
              <span className="text-sm text-gray-600">
                Notifications {notificationSettings.push ? 'activées' : 'désactivées'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Non lues</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <Bell className="text-red-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <AlertCircle className="text-red-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avertissements</p>
              <p className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length}
              </p>
            </div>
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <Info className="text-gray-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Serre</label>
            <select
              value={selectedSerre}
              onChange={(e) => setSelectedSerre(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Toutes les serres</option>
              {serres.map(serre => (
                <option key={serre.id} value={serre.id}>{serre.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Toutes les alertes</option>
              <option value="unread">Non lues</option>
              <option value="critical">Critiques</option>
              <option value="warning">Avertissements</option>
              <option value="info">Informations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <Bell size={32} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
            <p className="text-gray-500">Aucune alerte ne correspond aux filtres sélectionnés.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const serre = serres.find(s => s.id === alert.serreId);
            const sensor = serre?.sensors.find(s => s.id === alert.sensorId);
            
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border-2 p-4 md:p-6 shadow-sm ${
                  alert.acknowledged ? 'opacity-75' : ''
                } ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.severity)}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{serre?.name}</h3>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{sensor?.name}</span>
                        {!alert.acknowledged && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Non lue
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-800 mb-2">{alert.message}</p>
                      
                      <p className="text-sm text-gray-500">
                        {alert.timestamp.toLocaleDateString('fr-FR')} à {alert.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Marquer comme lue"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal des paramètres */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de notification</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notifications par email</span>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, email: !prev.email }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    notificationSettings.email ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notifications push</span>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, push: !prev.push }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    notificationSettings.push ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">SMS</span>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, sms: !prev.sms }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    notificationSettings.sms ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.sms ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Alertes critiques uniquement</span>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, criticalOnly: !prev.criticalOnly }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    notificationSettings.criticalOnly ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.criticalOnly ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heures de silence</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={notificationSettings.quietHours.start}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  <input
                    type="time"
                    value={notificationSettings.quietHours.end}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;