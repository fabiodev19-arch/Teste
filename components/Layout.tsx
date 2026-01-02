import React from 'react';
import { LayoutDashboard, ListTodo, Settings, LogOut } from 'lucide-react';
import { User } from '../types';
import { APP_VERSION } from '../config';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: 'inicio' | 'logs' | 'config';
  onTabChange: (tab: 'inicio' | 'logs' | 'config') => void;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, onTabChange, user, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white border-x-4 border-black">
      {/* Header */}
      <header className="bg-excalibur border-b-4 border-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black italic">
          <div className="bg-white brutal-border-sm p-0.5 overflow-hidden w-8 h-8 flex items-center justify-center">
            <img src="/logo-excalibur.jpg" alt="Logo" className="w-full h-auto" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-xl tracking-tighter uppercase">EXCALIBUR</h1>
            <span className="text-[8px] font-mono font-bold opacity-70 tracking-widest">{user.role} ACCESS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white text-black font-mono font-bold px-2 border-2 border-black text-sm">
            {APP_VERSION}
          </div>
          <button onClick={onLogout} className="text-white hover:text-black transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 p-4 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-4 border-black flex justify-around p-2 z-50">
        <NavItem
          active={currentTab === 'inicio'}
          onClick={() => onTabChange('inicio')}
          icon={<LayoutDashboard size={24} />}
          label="INICIO"
        />
        <NavItem
          active={currentTab === 'logs'}
          onClick={() => onTabChange('logs')}
          icon={<ListTodo size={24} />}
          label="LOGS"
        />
        {user.role === 'ADMIN' && (
          <NavItem
            active={currentTab === 'config'}
            onClick={() => onTabChange('config')}
            icon={<Settings size={24} />}
            label="CONFIG"
          />
        )}
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-excalibur' : 'text-gray-400'}`}
  >
    {icon}
    <span className="font-mono text-[10px] font-bold tracking-widest">{label}</span>
  </button>
);
