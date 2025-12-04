import { useState, useEffect } from 'react';
import { Serre, Sensor, Equipment } from '../types';

// Hook personnalisé pour la gestion des serres
export const useSerres = () => {
  const [serres, setSerres] = useState<Serre[]>([]);
  const [selectedSerre, setSelectedSerre] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Simulation de données pour la démo
  useEffect(() => {
    const mockSerres: Serre[] = [
      {
        id: '1',
        name: 'Serre Tomates Bio',
        location: 'Zone Nord',
        coordinates: { lat: 46.2276, lng: 2.2137 },
        status: 'active',
        sensors: [
          {
            id: 's1',
            name: 'Température Air',
            type: 'temperature',
            value: 24.5,
            unit: '°C',
            status: 'ok',
            lastUpdate: new Date(),
            serreId: '1'
          },
          {
            id: 's2',
            name: 'Humidité Air',
            type: 'humidity_air',
            value: 68,
            unit: '%',
            status: 'warning',
            lastUpdate: new Date(),
            serreId: '1'
          },
          {
            id: 's3',
            name: 'Humidité Sol',
            type: 'humidity_soil',
            value: 45,
            unit: '%',
            status: 'ok',
            lastUpdate: new Date(),
            serreId: '1'
          },
          {
            id: 's4',
            name: 'pH Sol',
            type: 'ph',
            value: 6.8,
            unit: 'pH',
            status: 'ok',
            lastUpdate: new Date(),
            serreId: '1'
          },
          {
            id: 's5',
            name: 'Luminosité',
            type: 'light',
            value: 850,
            unit: 'lux',
            status: 'ok',
            lastUpdate: new Date(),
            serreId: '1'
          }
        ],
        equipment: [
          {
            id: 'e1',
            name: 'Pompe Irrigation',
            type: 'pump',
            isActive: false,
            lastAction: new Date(Date.now() - 3600000),
            serreId: '1'
          },
          {
            id: 'e2',
            name: 'Ventilateur',
            type: 'fan',
            isActive: true,
            lastAction: new Date(Date.now() - 1800000),
            serreId: '1'
          },
          {
            id: 'e3',
            name: 'Éclairage LED',
            type: 'light',
            isActive: false,
            lastAction: new Date(Date.now() - 7200000),
            serreId: '1'
          }
        ]
      },
      {
        id: '2',
        name: 'Serre Légumes',
        location: 'Zone Sud',
        coordinates: { lat: 46.2200, lng: 2.2100 },
        status: 'active',
        sensors: [
          {
            id: 's6',
            name: 'Température Air',
            type: 'temperature',
            value: 22.1,
            unit: '°C',
            status: 'ok',
            lastUpdate: new Date(),
            serreId: '2'
          },
          {
            id: 's7',
            name: 'Humidité Air',
            type: 'humidity_air',
            value: 72,
            unit: '%',
            status: 'ok',
            lastUpdate: new Date(),
            serreId: '2'
          }
        ],
        equipment: [
          {
            id: 'e4',
            name: 'Pompe Irrigation',
            type: 'pump',
            isActive: true,
            lastAction: new Date(Date.now() - 600000),
            serreId: '2'
          }
        ]
      }
    ];

    setTimeout(() => {
      setSerres(mockSerres);
      setSelectedSerre(mockSerres[0].id);
      setLoading(false);
    }, 1000);
  }, []);

  const getCurrentSerre = () => {
    return serres.find(s => s.id === selectedSerre);
  };

  const updateSensorValue = (sensorId: string, value: number) => {
    setSerres(prev => prev.map(serre => ({
      ...serre,
      sensors: serre.sensors.map(sensor =>
        sensor.id === sensorId
          ? { ...sensor, value, lastUpdate: new Date() }
          : sensor
      )
    })));
  };

  const toggleEquipment = (equipmentId: string) => {
    setSerres(prev => prev.map(serre => ({
      ...serre,
      equipment: serre.equipment.map(eq =>
        eq.id === equipmentId
          ? { ...eq, isActive: !eq.isActive, lastAction: new Date() }
          : eq
      )
    })));
  };

  return {
    serres,
    selectedSerre,
    setSelectedSerre,
    loading,
    getCurrentSerre,
    updateSensorValue,
    toggleEquipment
  };
};