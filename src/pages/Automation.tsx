import React, { useState } from 'react';
import { Plus, Settings, Play, Pause, Trash2, ArrowRight } from 'lucide-react';
import { useSerres } from '../hooks/useSerres';
import { AutomationRule } from '../types';

const Automation: React.FC = () => {
  const { getCurrentSerre, serres, selectedSerre, setSelectedSerre } = useSerres();
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Ventilation automatique',
      condition: {
        sensorType: 'temperature',
        operator: '>',
        value: 28
      },
      action: {
        equipmentId: 'e2',
        action: 'turn_on',
        duration: 15
      },
      isActive: true,
      serreId: '1'
    },
    {
      id: '2',
      name: 'Irrigation programmée',
      condition: {
        sensorType: 'humidity_soil',
        operator: '<',
        value: 40
      },
      action: {
        equipmentId: 'e1',
        action: 'turn_on',
        duration: 10
      },
      isActive: false,
      serreId: '1'
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    condition: {
      sensorType: 'temperature',
      operator: '>',
      value: 25
    },
    action: {
      equipmentId: '',
      action: 'turn_on',
      duration: 10
    },
    isActive: true
  });

  const currentSerre = getCurrentSerre();

  const getSensorLabel = (sensorType: string) => {
    const labels: Record<string, string> = {
      temperature: 'Température',
      humidity_air: 'Humidité Air',
      humidity_soil: 'Humidité Sol',
      ph: 'pH',
      light: 'Luminosité'
    };
    return labels[sensorType] || sensorType;
  };

  const getEquipmentLabel = (equipmentId: string) => {
    if (!currentSerre) return equipmentId;
    const equipment = currentSerre.equipment.find(e => e.id === equipmentId);
    return equipment?.name || equipmentId;
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const createRule = () => {
    if (!newRule.name || !currentSerre) return;

    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      condition: newRule.condition!,
      action: newRule.action!,
      isActive: newRule.isActive!,
      serreId: currentSerre.id
    };

    setRules(prev => [...prev, rule]);
    setShowCreateRule(false);
    setNewRule({
      name: '',
      condition: {
        sensorType: 'temperature',
        operator: '>',
        value: 25
      },
      action: {
        equipmentId: '',
        action: 'turn_on',
        duration: 10
      },
      isActive: true
    });
  };

  if (!currentSerre) {
    return <div className="p-6">Aucune serre sélectionnée</div>;
  }

  const activeRules = rules.filter(rule => rule.serreId === currentSerre.id && rule.isActive);
  const inactiveRules = rules.filter(rule => rule.serreId === currentSerre.id && !rule.isActive);

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Automatisation</h1>
            <p className="text-gray-600">Gérez les règles d'automatisation pour {currentSerre.name}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedSerre}
              onChange={(e) => setSelectedSerre(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {serres.map(serre => (
                <option key={serre.id} value={serre.id}>{serre.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowCreateRule(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              <span>Nouvelle Règle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Règles actives</p>
              <p className="text-2xl font-bold text-green-600">{activeRules.length}</p>
            </div>
            <Play className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Règles inactives</p>
              <p className="text-2xl font-bold text-gray-600">{inactiveRules.length}</p>
            </div>
            <Pause className="text-gray-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Déclenchements</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Settings className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Liste des règles */}
      <div className="space-y-6">
        {/* Règles actives */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Règles actives</h2>
          <div className="space-y-4">
            {activeRules.map(rule => (
              <div key={rule.id} className="bg-white rounded-xl border border-green-200 p-4 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          SI
                        </span>
                        <span>
                          {getSensorLabel(rule.condition.sensorType)} {rule.condition.operator} {rule.condition.value}
                        </span>
                      </div>
                      
                      <ArrowRight size={16} className="text-gray-400 mx-2 hidden md:block" />
                      
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                          ALORS
                        </span>
                        <span>
                          {rule.action.action === 'turn_on' ? 'Activer' : 'Désactiver'} {getEquipmentLabel(rule.action.equipmentId)}
                          {rule.action.duration && ` pendant ${rule.action.duration}min`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Pause size={16} />
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {activeRules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings size={32} className="mx-auto mb-2 opacity-50" />
                <p>Aucune règle active</p>
              </div>
            )}
          </div>
        </div>

        {/* Règles inactives */}
        {inactiveRules.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Règles inactives</h2>
            <div className="space-y-4">
              {inactiveRules.map(rule => (
                <div key={rule.id} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm opacity-75">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <h3 className="font-semibold text-gray-700">{rule.name}</h3>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                            SI
                          </span>
                          <span>
                            {getSensorLabel(rule.condition.sensorType)} {rule.condition.operator} {rule.condition.value}
                          </span>
                        </div>
                        
                        <ArrowRight size={16} className="text-gray-400 mx-2 hidden md:block" />
                        
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                            ALORS
                          </span>
                          <span>
                            {rule.action.action === 'turn_on' ? 'Activer' : 'Désactiver'} {getEquipmentLabel(rule.action.equipmentId)}
                            {rule.action.duration && ` pendant ${rule.action.duration}min`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de création de règle */}
      {showCreateRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer une nouvelle règle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la règle</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ex: Ventilation automatique"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capteur</label>
                  <select
                    value={newRule.condition?.sensorType}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      condition: { ...prev.condition!, sensorType: e.target.value }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    {currentSerre.sensors.map(sensor => (
                      <option key={sensor.type} value={sensor.type}>
                        {getSensorLabel(sensor.type)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={newRule.condition?.operator}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      condition: { ...prev.condition!, operator: e.target.value as any }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value=">">Supérieur à</option>
                    <option value="<">Inférieur à</option>
                    <option value=">=">Supérieur ou égal</option>
                    <option value="<=">Inférieur ou égal</option>
                    <option value="=">Égal à</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valeur</label>
                  <input
                    type="number"
                    value={newRule.condition?.value}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      condition: { ...prev.condition!, value: parseFloat(e.target.value) }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Équipement</label>
                  <select
                    value={newRule.action?.equipmentId}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      action: { ...prev.action!, equipmentId: e.target.value }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Sélectionner</option>
                    {currentSerre.equipment.map(equipment => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                  <select
                    value={newRule.action?.action}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      action: { ...prev.action!, action: e.target.value as any }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="turn_on">Activer</option>
                    <option value="turn_off">Désactiver</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes)</label>
                <input
                  type="number"
                  value={newRule.action?.duration}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    action: { ...prev.action!, duration: parseInt(e.target.value) }
                  }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Durée en minutes"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateRule(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createRule}
                disabled={!newRule.name || !newRule.action?.equipmentId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Créer la règle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automation;