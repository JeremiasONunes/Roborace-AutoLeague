import { Link, useLocation } from 'react-router-dom';
import { Users, Trophy, Calendar, BarChart3, Zap, Settings, Eye, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Equipes', href: '/teams', icon: Users },
    { name: 'Grupos', href: '/groups', icon: Trophy },
    { name: 'Partidas', href: '/matches', icon: Calendar },
    { name: 'Ranking', href: '/ranking', icon: BarChart3 },
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  const openPublicView = () => {
    window.open('/view', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFCFB] flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#A7D9AE] border-r border-gray-100 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-sm relative`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-50">
          <div className="flex justify-center w-full">
            <div className="w-24 h-24">
              <img src="/logo.png" alt="Roborace Univas" className="w-full h-full object-contain" />
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1 absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2DA63F] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={openPublicView}
              className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <Eye className="w-4 h-4 mr-3" />
              Visualização Pública
            </button>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 mt-1"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </button>
          </div>
          
          {/* Créditos */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-center text-xs text-gray-500">
              <p className="font-medium">Desenvolvido por</p>
              <p className="font-semibold text-gray-600">Jeremias O Nunes</p>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-0">
        {/* Header mobile */}
        <div className="lg:hidden bg-white border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
                <img src="/logo.png" alt="Roborace Univas" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-base font-semibold text-gray-900">Roborace</h1>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}