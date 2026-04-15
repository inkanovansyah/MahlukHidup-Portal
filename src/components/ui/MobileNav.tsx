import { useState, useEffect } from 'react';
import { X, Menu, Sprout, Globe, BarChart3, Navigation, Sun, Building2, Users, Power } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

const navItems = [
  { id: 'monitoring', label: 'Monitor Geospasial', icon: Globe },
  { id: 'analytics', label: 'Analitik Keseluruhan', icon: BarChart3 },
  { id: 'drones', label: 'Analisa Drone', icon: Navigation, pro: true },
  { id: 'solar', label: 'Analisa Panel Surya', icon: Sun, pro: true },
  { id: 'companies', label: 'Manajemen Perusahaan', icon: Building2 },
  { id: 'users', label: 'Manajemen User', icon: Users },
];

export default function MobileNav({ activeTab, onTabChange, onLogout, userName, userRole }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <>
      {/* Burger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white hover:bg-slate-800 transition-all duration-300 shadow-lg"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sprout size={22} />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tighter text-white leading-none font-cyber italic">
                MH <span className="text-emerald-400">PRO</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-0.5 italic">
                Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {userName && (
          <div className="px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-full flex items-center justify-center text-slate-900 text-sm font-black shadow-lg shadow-emerald-500/20 flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userName}</p>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">{userRole}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-transform ${
                    isActive ? 'scale-110' : 'group-hover:rotate-12'
                  }`}
                />
                <span className="font-bold text-sm tracking-wide flex-1 text-left">{item.label}</span>
                {item.pro && (
                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-[8px] font-black text-white uppercase tracking-widest rounded-full">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900">
          <div className="px-3 py-4 space-y-3">
            {/* Version */}
            <div className="text-center">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">v2.6.0-PRO</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all text-red-400 hover:text-red-300 group"
            >
              <Power size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
