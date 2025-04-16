
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Clock, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-fastfuel-blue text-xl">Fast<span className="text-fastfuel-orange">Fuel</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-right">
            <p className="font-medium text-fastfuel-blue">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.role}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-fastfuel-blue flex items-center justify-center text-white">
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16 pt-1">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around px-4 py-2">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-fastfuel-orange' : 'text-gray-500'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigate('/nearby')}
            className={`flex flex-col items-center p-2 ${isActive('/nearby') ? 'text-fastfuel-orange' : 'text-gray-500'}`}
          >
            <MapPin size={20} />
            <span className="text-xs mt-1">Nearby</span>
          </button>
          <button
            onClick={() => navigate('/orders')}
            className={`flex flex-col items-center p-2 ${isActive('/orders') ? 'text-fastfuel-orange' : 'text-gray-500'}`}
          >
            <Clock size={20} />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center p-2 ${
              isActive('/profile') ? 'text-fastfuel-orange' : 'text-gray-500'
            }`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
