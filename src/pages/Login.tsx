import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sprout, ShieldCheck, ChevronRight, Mail, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login({ 
      id: '1', 
      name: 'Agronom Utama', 
      role: 'Agronom', 
      email: email || 'admin@mahlukhidup.id' 
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg-light relative flex items-center justify-center overflow-hidden font-outfit">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-sky-500/10 rounded-full blur-[150px] animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-3xl p-4 flex justify-center items-center">
        <Card className="flex flex-col lg:flex-row p-0 overflow-hidden shadow-2xl border-none w-full min-h-[420px]" padding={false}>
          {/* IMMERSIVE BRAND SIDE (Left) */}
          <div className="w-full lg:w-1/2 relative h-[200px] lg:h-auto overflow-hidden">
            <img
              src="/premium_agri_hub_3d_banner_1775291690359.png"
              alt="Futuristic Hub"
              className="absolute inset-0 w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/40 to-transparent backdrop-blur-[2px]" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white drop-shadow-2xl">
              <div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center mb-4 border border-white/20 shadow-2xl">
                  <Sprout className="text-white" size={22} />
                </div>
                <h1 className="text-2xl font-black mb-2 tracking-tighter uppercase font-cyber italic">
                  MAHLUK <span className="text-emerald-300">HIDUP</span>
                </h1>
                <p className="text-white/90 text-sm font-medium max-w-[200px] font-cyber leading-relaxed">
                  Pusat Intelijen Pertanian & Drone Monitoring Masa Depan.
                </p>
              </div>

            </div>
          </div>

          {/* FORM SIDE (Right) */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 bg-white flex flex-col justify-center relative overflow-hidden">
            {/* Subtle Texture Overlay */}
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10">
              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tight font-cyber">OTORISASI SISTEM</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Silakan masukkan kredensial akses utama Anda.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">ID Pengenal</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mahlukhidup.id"
                      className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder-slate-300 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Kredensial Keamanan</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder-slate-300 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-1 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer w-4 h-4 rounded-md border-slate-200 text-emerald-500 focus:ring-emerald-500/20" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-bold group-hover:text-slate-800 transition-colors">Tetap Terhubung</span>
                  </label>
                  <a href="#" className="text-[11px] text-emerald-600 font-black hover:text-emerald-500 transition-colors uppercase tracking-[0.1em]">Lupa sandi?</a>
                </div>

                <Button type="submit" variant="gradient" fullWidth className="py-3 rounded-xl text-sm font-cyber tracking-widest uppercase">
                  Masuk Sistem <ChevronRight size={16} className="ml-1.5 animate-pulse" />
                </Button>
              </form>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" /> AES-256 ENCRYPTED
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">v2.6.0-PRO</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-8 left-12 text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase hidden lg:block opacity-40">
        Agricultural IoT Ecosystem • Geo-Spatial Hub
      </div>
    </div>
  );
};

export default Login;
