import { useState, useEffect } from 'react';
import {
  Sprout, Globe, Power, ChevronRight, Navigation,
  BarChart3, AlertTriangle, ShieldCheck, CheckCircle2,
  Zap, Droplet, Leaf, Layers, Coins,
  Info, Camera, Sparkles, TrendingUp, TrendingDown, ThermometerSun,
  Bug, FlaskConical, Building2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MapView from '../components/ui/MapView';
import CompanyManagement from './CompanyManagement';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockMarkers: any[] = [
  { 
    id: 'sec-a', position: [-6.9147, 107.6098], title: "Sektor A - Ciwidey", description: "Vigoritas tanaman optimal (98%). Kelembapan tanah stabil.", 
    status: 'safe', luasLahan: '12.5 Hektar', cropType: 'Jagung Hibrida', plantHealth: '98%',
    tanah: { ph: '6.5', moisture: '72%', pupuk: 'Optimal' }, cuaca: { temp: '24°C', condition: 'Cerah Berawan' },
    risikoHama: 'Aman (1%)', finansial: { potensiKeuntungan: 'Rp 450.000.000', potensiRugi: 'Rp 5.000.000' },
    aiSaran: "Lahan dalam kondisi sangat optimal. Lanjutkan rutinitas irigasi standar. Tidak ada intervensi tambahan yang diperlukan saat ini.",
    photos: [] 
  },
  { 
    id: 'sec-b', position: [-6.8247, 107.6198], title: "Sektor B - Lembang", description: "Peringatan: Penurunan Nitrogen terdeteksi. Risiko hama ringan.", 
    status: 'warning', luasLahan: '8.2 Hektar', cropType: 'Padi Premium', plantHealth: '74%',
    tanah: { ph: '5.8', moisture: '45%', pupuk: 'Kurang Nitrogen' }, cuaca: { temp: '28°C', condition: 'Panas Terik' },
    risikoHama: 'Waspada (30%)', finansial: { potensiKeuntungan: 'Rp 280.000.000', potensiRugi: 'Rp 45.000.000' },
    aiSaran: "Terdapat indikasi evapotranspirasi tinggi. Disarankan meningkatkan volume irigasi sebesar 15% pada sore hari. Perhatikan indikasi awal hama kutu daun.",
    photos: ['/premium_agri_hub_3d_banner_1775291690359.png']
  },
  { 
    id: 'sec-c', position: [-6.9547, 107.6598], title: "Sektor C - Subang", description: "Kritis: Deteksi wabah wereng coklat & kekeringan akut.", 
    status: 'danger', luasLahan: '15.0 Hektar', cropType: 'Tomat Ceri', plantHealth: '42%',
    tanah: { ph: '4.8', moisture: '22%', pupuk: 'Kritis / Habis' }, cuaca: { temp: '32°C', condition: 'Kemarau Ekstrem' },
    risikoHama: 'Kritis (80%)', finansial: { potensiKeuntungan: 'Rp 120.000.000', potensiRugi: 'Rp 380.000.000' },
    aiSaran: "TINDAKAN KRITIS DIBUTUHKAN. Segera luncurkan drone penyemprotan (Fokus C-4). Tingkatkan irigasi drastis untuk mencegah kerusakan akar permanen.",
    photos: ['/dashboard_banner_landscape_1775291340460.png', '/plant_illustrations_set_1775291377414.png']
  },
];

const mockDrones = [
  { id: 'Drone-01', health: 98, battery: 85, status: 'Patroli', task: 'Scan NDVI Sektor A' },
  { id: 'Drone-02', health: 92, battery: 42, status: 'Kembali', task: 'RTL (Return to Launch)' },
  { id: 'Drone-03', health: 100, battery: 96, status: 'Siaga', task: 'Standby di Hub 1' },
  { id: 'Drone-04', health: 85, battery: 15, status: 'Charging', task: 'Pengisian Daya' },
];

const revenueData = [
  { month: 'Jan', revenue: 120, yield: 4.0 }, { month: 'Feb', revenue: 150, yield: 4.8 },
  { month: 'Mar', revenue: 180, yield: 5.2 }, { month: 'Apr', revenue: 140, yield: 4.5 },
  { month: 'Mei', revenue: 200, yield: 6.1 }, { month: 'Jun', revenue: 240, yield: 6.8 },
];
const cropDistributionData = [
  { name: 'Padi Premium', value: 45, color: '#10b981' }, { name: 'Jagung Hibrida', value: 30, color: '#f59e0b' },
  { name: 'Tomat Ceri', value: 15, color: '#0ea5e9' }, { name: 'Cabai Rawit', value: 10, color: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-white text-xs font-bold mb-2 uppercase">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex gap-2 items-center text-[10px] uppercase font-bold" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.name}:</span>
            <span className="text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monitoring');
  const [activeSector, setActiveSector] = useState(mockMarkers[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!mounted) return <div className="h-screen w-full bg-[#0b1730] flex items-center justify-center"><Sprout className="text-emerald-500 animate-bounce" size={48} /></div>;

  const getStatusColorClass = (status: string, opacity: string = '100') => {
    switch(status) {
      case 'danger': return `bg-red-500/${opacity} text-red-500 border-red-500`;
      case 'warning': return `bg-amber-500/${opacity} text-amber-500 border-amber-500`;
      case 'safe':
      default: return `bg-emerald-500/${opacity} text-emerald-500 border-emerald-500`;
    }
  };

  return (
    <div className="h-screen w-full bg-[#0b1730] flex text-slate-200 font-outfit overflow-hidden relative">
      {/* SOLID SIDEBAR */}
      <aside className="w-16 lg:w-56 h-screen z-50 bg-[#0d1f47] border-r border-blue-900/40 flex flex-col py-6 transition-all duration-700 flex-shrink-0 shadow-2xl shadow-black/30 relative">
        <div className="flex items-center gap-3 mb-8 px-5">
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <Sprout size={20} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black text-base tracking-tighter text-white leading-none font-cyber italic">MH <span className="text-emerald-400">PRO</span></h1>
            <p className="text-[8px] font-bold text-blue-400/70 uppercase tracking-[0.3em] mt-0.5 italic">Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 w-full space-y-1 px-3">
          {[
            { id: 'monitoring', label: 'Monitor Geospasial', icon: Globe, action: () => setActiveTab('monitoring') },
            { id: 'analytics', label: 'Analitik Keseluruhan', icon: BarChart3, action: () => setActiveTab('analytics') },
            { id: 'drones', label: 'Analisa Drone', icon: Navigation, action: () => setActiveTab('drones') },
            { id: 'companies', label: 'Manajemen Perusahaan', icon: Building2, action: () => setActiveTab('companies') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-500 group relative ${activeTab === item.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-blue-300/70 hover:text-white hover:bg-blue-800/30'}`}
            >
              <item.icon size={18} className={`flex-shrink-0 ${activeTab === item.id ? 'scale-110' : 'group-hover:rotate-12 outline-none'} transition-transform`} />
              <span className="hidden lg:block font-bold text-xs tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 pt-4 border-t border-blue-900/40">
          <Button variant="ghost" fullWidth onClick={handleLogout} className="rounded-xl py-3 text-red-400 hover:bg-red-900/20">
            <Power size={18} />
            <span className="hidden lg:block uppercase text-[9px] font-black tracking-widest leading-none">Logout</span>
          </Button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="relative flex-1 h-full overflow-hidden bg-[#0b1730]">
        
        {/* TAB 1: MONITORING GEOSPASIAL */}
        {activeTab === 'monitoring' && (
          <div className="relative h-full w-full">
            {/* FULL SCREEN MAP */}
            <div className="absolute inset-0 z-0">
              <MapView 
                markers={mockMarkers} 
                zoom={11} 
                center={activeSector ? activeSector.position : undefined}
                className="w-full h-full" 
                onMarkerClick={(m) => setActiveSector(m)}
              />
            </div>
            
            {/* Top Prompt overlay */}
            {!activeSector && (
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 backdrop-blur-xl bg-slate-800/80 border border-slate-700/50 text-white p-4 rounded-2xl px-8 shadow-2xl flex items-center gap-3">
                 <Info size={20} className="text-sky-400 animate-pulse" />
                 <p className="text-xs font-black tracking-widest uppercase">Klik Area Berwarna Pada Peta Secara Detail</p>
               </div>
            )}

            {/* SECTOR DETAILS FLOATING CARD (High Glassmorphism) */}
            {activeSector && (
              <div className="absolute right-6 top-6 bottom-6 w-[450px] z-40 bg-[#0b1730]/70 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-3xl border border-blue-700/30 flex flex-col pointer-events-auto p-6 pt-8 overflow-y-auto custom-scrollbar">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusColorClass(activeSector.status, '30')} bg-white/40 shadow-inner border border-white/30 backdrop-blur-md`}>
                         <span className={`w-2 h-2 rounded-full ${getStatusColorClass(activeSector.status)} animate-pulse`} />
                         {activeSector.status === 'safe' ? 'Zona Aman' : activeSector.status === 'warning' ? 'Terdapat Kendala Ringan' : 'Zona Bahaya & Kritis'}
                       </span>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase font-cyber italic leading-tight drop-shadow-sm">{activeSector.title}</h2>
                  </div>
                  <button onClick={() => setActiveSector(null)} className="w-8 h-8 rounded-full bg-blue-900/50 backdrop-blur-md border border-blue-700/40 flex items-center justify-center text-slate-300 shadow-sm hover:scale-110 hover:bg-blue-800/70 transition-all">✕</button>
                </div>

                <p className="text-xs font-bold text-slate-300 mb-6 bg-blue-900/30 backdrop-blur-md p-3 rounded-xl border border-blue-700/30 shadow-sm">{activeSector.description}</p>

                {/* Grid Info Dasar - 8 Items */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Komoditas / Crop Type */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-1 text-sky-400"><Sprout size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Komoditas</span></div>
                    <p className="text-lg font-black text-white">{activeSector.cropType}</p>
                  </div>
                  
                  {/* Luas Lahan Area */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-1 text-blue-300"><Layers size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Luas Lahan</span></div>
                    <p className="text-lg font-black text-white">{activeSector.luasLahan}</p>
                  </div>

                  {/* Plant Health */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                     <div className="flex items-center gap-2 mb-1 text-emerald-400"><Leaf size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Kesehatan Tanaman</span></div>
                     <p className={`text-lg font-black ${parseInt(activeSector.plantHealth) < 60 ? 'text-red-400' : parseInt(activeSector.plantHealth) < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{activeSector.plantHealth}</p>
                  </div>

                  {/* Pupuk (Nutrisi) */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                     <div className="flex items-center gap-2 mb-1 text-purple-400"><FlaskConical size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Kadar Pupuk (NPK)</span></div>
                     <p className={`text-lg font-black truncate leading-tight ${activeSector.status === 'danger' ? 'text-red-400' : activeSector.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>{activeSector.tanah.pupuk}</p>
                  </div>

                  {/* Pest Risk */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                     <div className="flex items-center gap-2 mb-1 text-rose-400"><Bug size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Risiko Hama</span></div>
                     <p className={`text-lg font-black truncate leading-tight ${activeSector.status === 'danger' ? 'text-red-400' : activeSector.status === 'warning' ? 'text-amber-400' : 'text-slate-200'}`}>{activeSector.risikoHama}</p>
                  </div>

                  {/* Cuaca */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                     <div className="flex items-center gap-2 mb-1 text-blue-300"><ThermometerSun size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Cuaca</span></div>
                     <div className="flex items-center gap-1.5">
                       <p className="text-xl font-black text-white leading-none">{activeSector.cuaca.temp}</p>
                       <p className="text-[8px] bg-blue-800/60 px-2 py-0.5 rounded-full text-blue-200 font-bold max-w-[60px] truncate border border-blue-600/40" title={activeSector.cuaca.condition}>{activeSector.cuaca.condition}</p>
                     </div>
                  </div>

                  {/* PH Tanah */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-1 text-amber-400"><AlertTriangle size={14} /><span className="text-[9px] font-black uppercase tracking-widest">PH Tanah</span></div>
                    <p className={`text-xl font-black leading-none ${parseFloat(activeSector.tanah.ph) < 6 ? 'text-red-400' : 'text-white'}`}>{activeSector.tanah.ph}</p>
                  </div>

                  {/* Kelembapan */}
                  <div className="p-3 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-700/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-1 text-sky-400"><Droplet size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Kelembapan</span></div>
                    <p className={`text-xl font-black leading-none ${parseInt(activeSector.tanah.moisture) < 40 ? 'text-amber-400' : 'text-white'}`}>{activeSector.tanah.moisture}</p>
                  </div>
                </div>

                {/* Potensi Keuangan */}
                <div className="bg-slate-900/40 backdrop-blur-xl text-white rounded-[1.5rem] p-5 mb-6 shadow-xl relative overflow-hidden border border-white/10 flex-shrink-0">
                  <div className="absolute -right-4 -bottom-4 text-white/5"><Coins size={100} /></div>
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-white/70 mb-4 italic">Proyeksi Finansial Di Lahan Ini</h3>
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-0.5"><TrendingUp size={12} /> Potensi Profit</p>
                      <p className="text-xl font-black italic">{activeSector.finansial.potensiKeuntungan}</p>
                    </div>
                    <div className="border-l border-white/10 pl-3">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 mb-0.5"><TrendingDown size={12} /> Risiko / Rugi</p>
                      <p className="text-lg font-black text-white">{activeSector.finansial.potensiRugi}</p>
                    </div>
                  </div>
                </div>

                {/* Visual Evidence */}
                {activeSector.photos.length > 0 && (
                  <div className="mb-6 flex-shrink-0 bg-blue-900/30 backdrop-blur-md p-4 rounded-2xl border border-blue-700/30 shadow-sm">
                    <h3 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-300 mb-3"><Camera size={12} /> Bukti Visual</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {activeSector.photos.map((photo: string, i: number) => (
                        <div key={i} className="min-w-[140px] h-24 rounded-lg overflow-hidden shadow-sm group cursor-zoom-in relative border border-white/40">
                           <img src={photo} alt="Bukti Masalah" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saran AI at the very bottom */}
                <div className={`mt-auto p-5 rounded-2xl border flex-shrink-0 backdrop-blur-xl shadow-lg
                  ${activeSector.status === 'danger' ? 'bg-red-500/20 border-red-500/30' : 
                    activeSector.status === 'warning' ? 'bg-amber-500/20 border-amber-500/30' : 
                    'bg-emerald-500/20 border-emerald-500/30'}`}>
                  <h3 className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-2 
                    ${activeSector.status === 'danger' ? 'text-red-700' : 
                      activeSector.status === 'warning' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    <Sparkles size={14} /> Rekomendasi AI Agronom
                  </h3>
                  <p className="text-xs font-bold text-slate-200 leading-relaxed italic drop-shadow-sm bg-blue-900/40 p-2 rounded-lg border border-blue-700/30 mb-4">"{activeSector.aiSaran}"</p>
                  
                  {activeSector.status !== 'safe' && (
                    <Button variant="primary" size="sm" className={`w-full text-[9px] uppercase font-black tracking-widest rounded-lg 
                      ${activeSector.status === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_5px_15px_rgba(220,38,38,0.3)]' : 
                      'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_5px_15px_rgba(245,158,11,0.3)] border-none'}`}>
                      Automasi Tindakan Resolusi
                    </Button>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANALITIK KESELURUHAN */}
        {activeTab === 'analytics' && (
          <div className="p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar bg-[#0b1730]">
             {/* Component kept exactly identical */}
             <header className="mb-10">
               <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-cyber italic">ANALITIK KESELURUHAN</h2>
               <p className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mt-1">Laporan Komprehensif Ekosistem Mahluk Hidup</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="hover:border-emerald-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform"><Coins size={20} /></div>
                     <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">↑ 24%</span>
                   </div>
                   <div className="mt-4">
                     <p className="text-[9px] font-black text-blue-400/70 uppercase tracking-widest mb-1">Total Pendapatan</p>
                     <p className="text-2xl font-black tracking-tighter text-white italic">Rp 4.2<span className="text-sm ml-1 text-blue-400/70 uppercase">Milyar</span></p>
                   </div>
                </Card>
                <Card className="hover:border-sky-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-3 bg-sky-500/20 text-sky-400 rounded-lg group-hover:scale-110 transition-transform"><Leaf size={20} /></div>
                     <span className="text-[10px] font-black text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded-full">↑ 18%</span>
                   </div>
                   <div className="mt-4">
                     <p className="text-[9px] font-black text-blue-400/70 uppercase tracking-widest mb-1">Total Panen (Tonase)</p>
                     <p className="text-2xl font-black tracking-tighter text-white italic">86.5<span className="text-sm ml-1 text-blue-400/70 uppercase">Ton</span></p>
                   </div>
                </Card>
                <Card className="hover:border-amber-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg group-hover:scale-110 transition-transform"><Layers size={20} /></div>
                   </div>
                   <div className="mt-4">
                     <p className="text-[9px] font-black text-blue-400/70 uppercase tracking-widest mb-1">Lahan Produktif</p>
                     <p className="text-2xl font-black tracking-tighter text-white italic">4.2<span className="text-sm ml-1 text-blue-400/70 uppercase">Hektar</span></p>
                   </div>
                </Card>
                <Card className="hover:border-emerald-500/30 transition-all group bg-emerald-500 text-white border-none shadow-xl shadow-emerald-500/20" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-3 bg-white/20 text-white rounded-lg group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                   </div>
                   <div className="mt-4">
                     <p className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-1">Kesehatan Tanaman</p>
                     <p className="text-2xl font-black tracking-tighter italic">92.4<span className="text-sm ml-1 text-emerald-200 uppercase">%</span></p>
                   </div>
                </Card>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="lg:col-span-2 shadow-xl" padding={true}>
                 <div className="mb-6 flex justify-between items-center">
                   <div>
                     <h3 className="font-black text-sm tracking-widest uppercase text-white italic underline decoration-emerald-500/30">Tren Pendapatan & Panen</h3>
                     <p className="text-[10px] text-blue-400/70 mt-1 uppercase font-bold">Data 6 Bulan Terakhir</p>
                   </div>
                 </div>
                 <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} width={60} />
                       <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Area type="monotone" dataKey="revenue" name="Pendapatan (Juta)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                       <Area type="monotone" dataKey="yield" name="Panen (Ton)" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </Card>
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-2">
                   <h3 className="font-black text-sm tracking-widest uppercase text-white italic underline decoration-sky-500/30">Distribusi Tanaman</h3>
                   <p className="text-[10px] text-blue-400/70 mt-1 uppercase font-bold">Komposisi Ekosistem Saat Ini</p>
                 </div>
                 <div className="h-[240px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={cropDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                         {cropDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                       <RechartsTooltip content={<CustomTooltip />} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               </Card>
             </div>
          </div>
        )}

        {/* TAB 3: ANALISA DRONE */}
        {activeTab === 'drones' && (
          <div className="p-10 h-full overflow-y-auto custom-scrollbar bg-[#0b1730]">
             <header className="mb-10">
               <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-cyber italic">ANALISA ARMADA DRONE</h2>
               <p className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mt-1">Status: Node-01 Armada AKTIF • Sinergi Agrikultur</p>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* OVERALL HEALTH BENTO */}
               <Card className="lg:col-span-12 xl:col-span-4 bg-slate-800 text-white border-none shadow-2xl flex flex-col justify-between" padding={true}>
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-lg"><ShieldCheck size={32} className="animate-pulse" /></div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Integritas Fleet</p>
                       <p className="text-4xl font-black italic">94<span className="text-lg opacity-50">%</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight mb-2 uppercase font-cyber italic">Kesehatan Armada</h3>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">Sistem diagnostik mendeteksi optimalisasi pada 4/4 drone yang beroperasi.</p>
                  </div>
                  <div className="mt-8 flex gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  </div>
               </Card>

               {/* INDIVIDUAL DRONE CARDS */}
               <div className="lg:col-span-12 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {mockDrones.map((drone) => (
                   <Card key={drone.id} className="group hover:border-emerald-500/30 transition-all duration-500" padding={true}>
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${drone.status === 'Charging' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {drone.status === 'Charging' ? <Zap size={20} /> : <Navigation size={20} className="rotate-45" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-blue-400/70 uppercase tracking-widest">{drone.id}</p>
                            <p className="text-xs font-black text-white">{drone.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-blue-400/70 uppercase tracking-widest leading-none">Batre</p>
                          <p className={`text-xl font-black italic mt-1 ${drone.battery < 20 ? 'text-red-400' : 'text-white'}`}>{drone.battery}%</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-[9px] font-black text-blue-400/70 uppercase tracking-widest">
                           <span>Kesehatan Sistem</span>
                           <span>{drone.health}%</span>
                        </div>
                        <div className="h-1.5 bg-blue-950 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${drone.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${drone.health}%` }} 
                          />
                        </div>
                        <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <CheckCircle2 size={12} className="text-emerald-500" /> {drone.task}
                        </div>
                      </div>
                   </Card>
                 ))}
               </div>

               {/* TASK MANAGEMENT BENTO (Bottom Left) */}
               <Card className="lg:col-span-12 xl:col-span-7" padding={true}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-sm tracking-widest uppercase italic underline decoration-emerald-500/30 text-white">Tugas Terjadwal</h3>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black tracking-widest uppercase">Lihat Historical</Button>
                  </div>
                  <div className="space-y-6">
                    {[
                      { task: 'Mapping Lahan Sektor C', desc: 'Pemindaian resolusi tinggi 2cm/pixel', time: '14:00', priority: 'High' },
                      { task: 'Analisa Hama Blok B', time: '16:30', desc: 'Identifikasi populasi wereng', priority: 'Mid' },
                      { task: 'Patroli Malam Sektor A-B', time: '21:00', desc: 'Keamanan perimeter malam', priority: 'Low' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-6 p-4 rounded-lg bg-blue-900/20 border border-blue-800/30 hover:translate-x-1 transition-transform group">
                         <div className="w-12 h-12 bg-blue-900/40 rounded-lg shadow-sm flex flex-col items-center justify-center leading-none">
                            <span className="text-[10px] font-bold text-blue-400/70 uppercase leading-none mb-1">Jam</span>
                            <span className="text-xs font-black text-white">{t.time}</span>
                         </div>
                         <div className="flex-1">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic">Task 0{i+1}</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{t.task}</h4>
                            <p className="text-[10px] text-blue-300/60 mt-1">{t.desc}</p>
                         </div>
                         <div className="text-right flex items-center gap-3">
                            <div className="hidden sm:block">
                               <p className="text-[9px] font-bold text-blue-400/70 uppercase tracking-widest">Prioritas</p>
                               <p className={`text-[10px] font-black ${t.priority === 'High' ? 'text-red-400' : 'text-slate-300'}`}>{t.priority}</p>
                            </div>
                            <button className="p-2 text-blue-700 hover:text-emerald-400 transition-colors"><ChevronRight size={20} /></button>
                         </div>
                      </div>
                    ))}
                  </div>
               </Card>

               {/* QUICK ACTION BENTO (Bottom Right) */}
               <Card className="lg:col-span-12 xl:col-span-5 bg-white shadow-xl relative overflow-hidden group border-none" padding={false}>
                  <img src="/premium_agri_hub_3d_banner_1775291690359.png" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-[3s]" />
                  <div className="relative p-10 h-full flex flex-col justify-between">
                     <div>
                       <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">Sistem Kontrol</h3>
                       <p className="text-xs text-blue-300/60 font-medium leading-relaxed max-w-xs mt-2 italic">Gunakan kendali otomatis untuk memulai misi pemantauan baru secara instan di sektor terdaftar.</p>
                     </div>
                     <div className="mt-10 flex flex-col gap-3">
                        <Button variant="primary" fullWidth className="py-5 text-sm tracking-widest uppercase rounded-xl">Mulai Misi Baru</Button>
                        <Button variant="secondary" fullWidth className="py-5 text-sm tracking-widest uppercase rounded-xl">Mulai Patroli Hama</Button>
                     </div>
                  </div>
               </Card>
             </div>
          </div>
        )}

        {/* TAB 4: MANAJEMEN PERUSAHAAN */}
        {activeTab === 'companies' && (
          <CompanyManagement />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
