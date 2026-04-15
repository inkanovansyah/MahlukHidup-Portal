import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout, Globe, Power, Navigation,
  BarChart3, Building2, Sun, Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'monitoring', label: 'Monitor Geospasial', icon: Globe, path: '/dashboard' },
    { id: 'analytics', label: 'Analitik Keseluruhan', icon: BarChart3, path: '/analytics' },
    { id: 'drones', label: 'Analisa Drone', icon: Navigation, path: '/drones', pro: true },
    { id: 'solar', label: 'Analisa Panel Surya', icon: Sun, path: '/solar', pro: true },
    { id: 'companies', label: 'Manajemen Perusahaan', icon: Building2, path: '/companies' },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    const item = navItems.find(n => n.path === path);
    return item ? item.id : 'monitoring';
  };

  const activeTab = getActiveTab();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex text-slate-800 font-outfit overflow-hidden relative">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SOLID SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[60] lg:z-50
        w-64 lg:w-16 xl:w-56 h-screen 
        bg-slate-900 border-r border-slate-800 
        flex flex-col py-6 transition-all duration-500 flex-shrink-0 
        shadow-2xl lg:shadow-md shadow-black/30
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8 px-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <Sprout size={20} />
            </div>
            <div className="lg:hidden xl:block">
              <h1 className="font-black text-base tracking-tighter text-white leading-none font-cyber italic">MH <span className="text-emerald-400">PRO</span></h1>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-0.5 italic">Intelligence</p>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 w-full space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-500 group relative ${
                activeTab === item.id
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={18} className={`flex-shrink-0 ${activeTab === item.id ? 'scale-110' : 'group-hover:rotate-12 outline-none'} transition-transform`} />
              <span className="lg:hidden xl:block font-bold text-xs tracking-wide">{item.label}</span>
              {item.pro && <span className="lg:hidden xl:inline-flex ml-auto px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-[7px] font-black text-white uppercase tracking-widest rounded-full">PRO</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 pt-4 border-t border-slate-800">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-center">
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">v2.6.0-PRO</p>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="relative flex-1 h-full overflow-hidden bg-slate-50 flex flex-col">
        {/* TOP NAVBAR */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-4 flex-shrink-0 z-40">
          {/* Left: Mobile Toggle + Page Title */}
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xs md:text-sm font-black text-white uppercase font-cyber italic tracking-tight truncate max-w-[120px] md:max-w-none">
              {pageTitle}
            </h2>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 pr-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-200 truncate leading-tight">{user.name}</p>
                    <p className="text-[8px] text-emerald-400 font-black uppercase tracking-wider">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-black shadow-lg shadow-emerald-500/20 flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all text-red-400 hover:text-red-300 group"
                  title="Logout"
                >
                  <Power size={14} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
