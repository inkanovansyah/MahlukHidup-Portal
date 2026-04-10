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

      <div className="relative z-10 w-full max-w-5xl p-6 flex justify-center items-center">
        <Card className="flex flex-col lg:flex-row p-0 overflow-hidden shadow-2xl border-none w-full min-h-[550px]" padding={false}>
          {/* IMMERSIVE BRAND SIDE (Left) */}
          <div className="w-full lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
            <img 
              src="/premium_agri_hub_3d_banner_1775291690359.png" 
              alt="Futuristic Hub" 
              className="absolute inset-0 w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/40 to-transparent backdrop-blur-[2px]" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-between text-white drop-shadow-2xl">
              <div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
                  <Sprout className="text-white" size={32} />
                </div>
                <h1 className="text-4xl font-black mb-3 tracking-tighter uppercase font-cyber italic">
                  MAHLUK <span className="text-emerald-300">HIDUP</span>
                </h1>
                <p className="text-white/90 text-lg font-medium max-w-sm font-cyber leading-relaxed">
                  Pusat Intelijen Pertanian & Drone Monitoring Masa Depan.
                </p>
              </div>

            </div>
          </div>

          {/* FORM SIDE (Right) */}
          <div className="w-full lg:w-1/2 p-10 lg:p-12 bg-white flex flex-col justify-center relative overflow-hidden">
            {/* Subtle Texture Overlay */}
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight font-cyber">OTORISASI SISTEM</h2>
                <p className="text-slate-500 font-medium mt-2">Silakan masukkan kredensial akses utama Anda.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">ID Pengenal</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mahlukhidup.id"
                      className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-5 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder-slate-300 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Kredensial Keamanan</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-5 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder-slate-300 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer w-5 h-5 rounded-lg border-slate-200 text-emerald-500 focus:ring- emerald-500/20" />
                    </div>
                    <span className="text-xs text-slate-500 font-bold group-hover:text-slate-800 transition-colors">Tetap Terhubung</span>
                  </label>
                  <a href="#" className="text-xs text-emerald-600 font-black hover:text-emerald-500 transition-colors uppercase tracking-[0.1em]">Lupa sandi?</a>
                </div>

                <Button type="submit" variant="gradient" fullWidth className="py-6 rounded-[1.5rem] text-lg font-cyber tracking-widest uppercase">
                  Masuk Sistem <ChevronRight size={22} className="ml-2 animate-pulse" />
                </Button>
              </form>

              <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> AES-256 ENCRYPTED
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.6.0-PRO</p>
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
