// Types et interfaces pour l'application NaFa - SuivSerres

export interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity_air' | 'humidity_soil' | 'ph' | 'light';
  value: number;
  unit: string;
  status: 'ok' | 'warning' | 'critical';
  lastUpdate: Date;
  serreId: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'pump' | 'fan' | 'light' | 'heater' | 'cooling';
  isActive: boolean;
  lastAction: Date;
  serreId: string;
}

export interface Serre {
  id: string;
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  sensors: Sensor[];
  equipment: Equipment[];
  status: 'active' | 'maintenance' | 'offline';
}

export interface Alert {
  id: string;
  serreId: string;
  sensorId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: {
    sensorType: string;
    operator: '>' | '<' | '=' | '>=' | '<=';
    value: number;
  };
  action: {
    equipmentId: string;
    action: 'turn_on' | 'turn_off';
    duration?: number; // en minutes
  };
  isActive: boolean;
  serreId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'viewer';
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: 'fr' | 'en';
  };
}

export interface HistoricalData {
  id: string;
  sensorId: string;
  value: number;
  timestamp: Date;
}