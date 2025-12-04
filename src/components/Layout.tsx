import React from 'react';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Zap, 
  MapPin, 
  Bell, 
  User,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  onPageChange,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home },
    { id: 'history', label: 'Historique', icon: BarChart3 },
    { id: 'automation', label: 'Automatisation', icon: Settings },
    { id: 'control', label: 'Contrôle', icon: Zap },
    { id: 'serres', label: 'Mes Serres', icon: MapPin },
    { id: 'alerts', label: 'Alertes', icon: Bell },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">NaFa</h1>
            <p className="text-xs text-gray-500">SuivSerres</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">NaFa</h1>
                  <p className="text-sm text-gray-500">SuivSerres</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Status MQTT */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Connexion MQTT active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex flex-col w-80 max-w-xs bg-white shadow-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} className="mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Navigation Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex justify-around">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-green-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;