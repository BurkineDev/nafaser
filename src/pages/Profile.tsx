import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Globe, Palette, Save } from 'lucide-react';
import { User as UserType } from '../types';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>({
    id: '1',
    email: 'agriculteur@nafa.com',
    name: 'Jean Dupont',
    role: 'admin',
    preferences: {
      notifications: true,
      theme: 'light',
      language: 'fr'
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrateur',
      technician: 'Technicien',
      viewer: 'Observateur'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      technician: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Settings size={16} />
            <span>Modifier le profil</span>
          </button>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <User size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
        </div>
        
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                <span>Sauvegarder</span>
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nom complet</p>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rôle</p>
              <p className="text-gray-900">{getRoleLabel(user.role)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Membre depuis</p>
              <p className="text-gray-900">Janvier 2024</p>
            </div>
          </div>
        )}
      </div>

      {/* Préférences */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Settings size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Préférences</h2>
        </div>
        
        <div className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center space-x-2 mb-4">
            <Bell size={18} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="ml-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Notifications push</span>
              <button
                onClick={() => setUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, notifications: !prev.preferences.notifications }
                }))}
                className={`w-11 h-6 rounded-full transition-colors ${
                  user.preferences.notifications ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Thème */}
          <div className="flex items-center space-x-2 mb-4">
            <Palette size={18} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">Apparence</h3>
          </div>
          <div className="ml-6">
            <select
              value={user.preferences.theme}
              onChange={(e) => setUser(prev => ({
                ...prev,
                preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' }
              }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="light">Thème clair</option>
              <option value="dark">Thème sombre</option>
            </select>
          </div>

          {/* Langue */}
          <div className="flex items-center space-x-2 mb-4">
            <Globe size={18} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">Langue</h3>
          </div>
          <div className="ml-6">
            <select
              value={user.preferences.language}
              onChange={(e) => setUser(prev => ({
                ...prev,
                preferences: { ...prev.preferences, language: e.target.value as 'fr' | 'en' }
              }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Shield size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
        </div>
        
        <div className="space-y-4">
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Changer le mot de passe</p>
                <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
              </div>
              <span className="text-green-600">→</span>
            </div>
          </button>
          
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Inactif
              </span>
            </div>
          </button>
          
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sessions actives</p>
                <p className="text-sm text-gray-500">Gérez vos connexions</p>
              </div>
              <span className="text-green-600">→</span>
            </div>
          </button>
        </div>
      </div>

      {/* Statistiques d'utilisation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques d'utilisation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">47</p>
            <p className="text-sm text-gray-600">Connexions ce mois</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-sm text-gray-600">Actions effectuées</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">23h</p>
            <p className="text-sm text-gray-600">Temps total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;