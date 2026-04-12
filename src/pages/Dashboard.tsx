import { useState, useEffect } from 'react';
import {
  Sprout, Globe, Power, ChevronRight, Navigation,
  BarChart3, AlertTriangle, ShieldCheck, CheckCircle2,
  Zap, Droplet, Leaf, Layers, Coins,
  Info, Camera, Sparkles, TrendingUp, TrendingDown, ThermometerSun,
  Bug, FlaskConical, Building2, Wheat, AlertOctagon,
  Clock, ArrowUpRight, ArrowDownRight, Eye, Activity, MapPin, Users
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MapView from '../components/ui/MapView';
import CompanyManagement from './CompanyManagement';
import UserManagement from './UserManagement';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, LineChart, Line } from 'recharts';

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
const cropDistributionData = [
  { name: 'Padi Premium', value: 45, color: '#10b981' }, { name: 'Jagung Hibrida', value: 35, color: '#f59e0b' },
  { name: 'Tomat Ceri', value: 20, color: '#0ea5e9' },
];

// ====== ALL ANALYTICS DATA DERIVEd FROM mockMarkers ======

// Compute sector data from mockMarkers
const _rawSectors = mockMarkers.map((m) => ({
  ...m,
  health: parseInt(m.plantHealth),
  ph: parseFloat(m.tanah.ph),
  moisture: parseInt(m.tanah.moisture),
  nitrogen: m.tanah.pupuk === 'Optimal' ? 95 : m.tanah.pupuk.includes('Kurang') ? 55 : m.tanah.pupuk.includes('Kritis') ? 30 : 70,
  pestWereng: m.status === 'danger' ? 12 : m.status === 'warning' ? 5 : 0,
  pestUlat: m.status === 'danger' ? 8 : m.status === 'warning' ? 3 : 1,
  pestKutu: m.status === 'danger' ? 6 : m.status === 'warning' ? 4 : 0,
  pestBelalang: m.status === 'danger' ? 4 : m.status === 'warning' ? 2 : 0,
  waterUsage: m.status === 'danger' ? 180 : m.status === 'warning' ? 120 : 80,
  waterRainfall: m.status === 'danger' ? 10 : m.status === 'warning' ? 30 : 50,
  yieldCurrent: m.status === 'danger' ? 2.1 : m.status === 'warning' ? 5.2 : 8.5,
  yieldTarget: m.status === 'danger' ? 8.0 : m.status === 'warning' ? 6.0 : 8.0,
  revenue: parseInt(m.finansial.potensiKeuntungan.replace(/\D/g, '')) / 1000000,
  cost: parseInt(m.finansial.potensiRugi.replace(/\D/g, '')) / 1000000,
  alerts: m.status === 'danger' ? 15 : m.status === 'warning' ? 8 : 2,
  resolved: m.status === 'danger' ? 8 : m.status === 'warning' ? 6 : 2,
  critical: m.status === 'danger' ? 5 : m.status === 'warning' ? 1 : 0,
  luasHa: parseFloat(m.luasLahan),
}));

// Aggregated KPIs from mockMarkers
const totalRevenue = _rawSectors.reduce((sum, s) => sum + s.revenue, 0); // in millions
const totalYield = _rawSectors.reduce((sum, s) => sum + s.yieldCurrent, 0);
const totalArea = _rawSectors.reduce((sum, s) => sum + s.luasHa, 0);
const avgHealth = Math.round(_rawSectors.reduce((sum, s) => sum + s.health, 0) / _rawSectors.length);
const totalAlerts = _rawSectors.reduce((sum, s) => sum + s.alerts, 0);
const totalResolved = _rawSectors.reduce((sum, s) => sum + s.resolved, 0);

// Revenue trend (scaled from current sectors)
const revenueData = [
  { month: 'Jan', revenue: Math.round(totalRevenue * 0.55), yield: +(totalYield * 0.55).toFixed(1) },
  { month: 'Feb', revenue: Math.round(totalRevenue * 0.62), yield: +(totalYield * 0.62).toFixed(1) },
  { month: 'Mar', revenue: Math.round(totalRevenue * 0.70), yield: +(totalYield * 0.68).toFixed(1) },
  { month: 'Apr', revenue: Math.round(totalRevenue * 0.58), yield: +(totalYield * 0.60).toFixed(1) },
  { month: 'Mei', revenue: Math.round(totalRevenue * 0.78), yield: +(totalYield * 0.75).toFixed(1) },
  { month: 'Jun', revenue: Math.round(totalRevenue * 0.92), yield: +(totalYield * 0.85).toFixed(1) },
];

// Soil quality trend — derived from current sector conditions
const _avgPh = (_rawSectors.reduce((sum, s) => sum + s.ph, 0) / _rawSectors.length).toFixed(1);
const _avgMoisture = Math.round(_rawSectors.reduce((sum, s) => sum + s.moisture, 0) / _rawSectors.length);
const _avgNitrogen = Math.round(_rawSectors.reduce((sum, s) => sum + s.nitrogen, 0) / _rawSectors.length);
const soilQualityData = [
  { month: 'Jan', ph: +(parseFloat(_avgPh) - 0.3).toFixed(1), moisture: Math.max(_avgMoisture - 10, 20), nitrogen: Math.max(_avgNitrogen - 15, 20) },
  { month: 'Feb', ph: +(parseFloat(_avgPh) - 0.2).toFixed(1), moisture: Math.max(_avgMoisture - 5, 25), nitrogen: Math.max(_avgNitrogen - 10, 25) },
  { month: 'Mar', ph: +(parseFloat(_avgPh) - 0.4).toFixed(1), moisture: Math.max(_avgMoisture - 15, 15), nitrogen: Math.max(_avgNitrogen - 20, 15) },
  { month: 'Apr', ph: +(parseFloat(_avgPh) - 0.5).toFixed(1), moisture: Math.max(_avgMoisture - 20, 10), nitrogen: Math.max(_avgNitrogen - 25, 10) },
  { month: 'Mei', ph: +(parseFloat(_avgPh) - 0.1).toFixed(1), moisture: Math.max(_avgMoisture - 3, 30), nitrogen: Math.max(_avgNitrogen - 5, 35) },
  { month: 'Jun', ph: _avgPh, moisture: _avgMoisture, nitrogen: _avgNitrogen },
];

// Pest detection — derived from current sector pest counts
const totalWereng = _rawSectors.reduce((sum, s) => sum + s.pestWereng, 0);
const totalUlat = _rawSectors.reduce((sum, s) => sum + s.pestUlat, 0);
const totalKutu = _rawSectors.reduce((sum, s) => sum + s.pestKutu, 0);
const totalBelalang = _rawSectors.reduce((sum, s) => sum + s.pestBelalang, 0);
const pestDetectionData = [
  { month: 'Jan', wereng: Math.max(Math.round(totalWereng * 0.15), 1), ulat: Math.max(Math.round(totalUlat * 0.12), 0), kutu: Math.max(Math.round(totalKutu * 0.1), 0), belalang: Math.max(Math.round(totalBelalang * 0.1), 0) },
  { month: 'Feb', wereng: Math.max(Math.round(totalWereng * 0.25), 1), ulat: Math.max(Math.round(totalUlat * 0.2), 0), kutu: Math.max(Math.round(totalKutu * 0.2), 0), belalang: Math.max(Math.round(totalBelalang * 0.15), 0) },
  { month: 'Mar', wereng: Math.max(Math.round(totalWereng * 0.5), 1), ulat: Math.max(Math.round(totalUlat * 0.45), 0), kutu: Math.max(Math.round(totalKutu * 0.4), 0), belalang: Math.max(Math.round(totalBelalang * 0.35), 0) },
  { month: 'Apr', wereng: Math.max(Math.round(totalWereng * 0.35), 1), ulat: Math.max(Math.round(totalUlat * 0.3), 0), kutu: Math.max(Math.round(totalKutu * 0.35), 0), belalang: Math.max(Math.round(totalBelalang * 0.25), 0) },
  { month: 'Mei', wereng: Math.max(Math.round(totalWereng * 0.2), 1), ulat: Math.max(Math.round(totalUlat * 0.15), 0), kutu: Math.max(Math.round(totalKutu * 0.15), 0), belalang: Math.max(Math.round(totalBelalang * 0.1), 0) },
  { month: 'Jun', wereng: totalWereng, ulat: totalUlat, kutu: totalKutu, belalang: totalBelalang },
];

// Water usage — derived from sector water data
const totalWaterUsage = _rawSectors.reduce((sum, s) => sum + s.waterUsage, 0);
const totalWaterRain = _rawSectors.reduce((sum, s) => sum + s.waterRainfall, 0);
const waterUsageData = [
  { month: 'Jan', usage: Math.round(totalWaterUsage * 0.7), rainfall: Math.round(totalWaterRain * 0.8) },
  { month: 'Feb', usage: Math.round(totalWaterUsage * 0.65), rainfall: Math.round(totalWaterRain * 0.9) },
  { month: 'Mar', usage: Math.round(totalWaterUsage * 0.75), rainfall: Math.round(totalWaterRain * 0.6) },
  { month: 'Apr', usage: Math.round(totalWaterUsage * 0.8), rainfall: Math.round(totalWaterRain * 0.4) },
  { month: 'Mei', usage: Math.round(totalWaterUsage * 0.6), rainfall: Math.round(totalWaterRain * 1.0) },
  { month: 'Jun', usage: totalWaterUsage, rainfall: totalWaterRain },
];

// Sector performance — directly from mockMarkers
const sectorPerformanceData = _rawSectors.map((s) => ({
  sector: s.title.replace('Sektor ', ''),
  health: s.health,
  yield: +s.yieldCurrent.toFixed(1),
  profit: Math.round(s.revenue - s.cost),
  status: s.status === 'danger' ? 'Kritis' : s.status === 'warning' ? 'Warning' : 'Optimal',
}));

// Monthly alerts — derived from current sector alert counts
const totalAlertsCount = _rawSectors.reduce((sum, s) => sum + s.alerts, 0);
const totalResolvedCount = _rawSectors.reduce((sum, s) => sum + s.resolved, 0);
const monthlyAlertsData = [
  { month: 'Jan', alerts: Math.max(Math.round(totalAlertsCount * 0.1), 1), resolved: Math.max(Math.round(totalResolvedCount * 0.08), 0) },
  { month: 'Feb', alerts: Math.max(Math.round(totalAlertsCount * 0.2), 1), resolved: Math.max(Math.round(totalResolvedCount * 0.15), 0) },
  { month: 'Mar', alerts: Math.max(Math.round(totalAlertsCount * 0.4), 2), resolved: Math.max(Math.round(totalResolvedCount * 0.3), 1) },
  { month: 'Apr', alerts: Math.max(Math.round(totalAlertsCount * 0.3), 1), resolved: Math.max(Math.round(totalResolvedCount * 0.25), 1) },
  { month: 'Mei', alerts: Math.max(Math.round(totalAlertsCount * 0.15), 1), resolved: Math.max(Math.round(totalResolvedCount * 0.12), 0) },
  { month: 'Jun', alerts: totalAlertsCount, resolved: totalResolvedCount },
];

// Crop yield by type — derived from sectors
const cropYieldByType = [
  { crop: _rawSectors[1].cropType, yield: _rawSectors[1].yieldCurrent, target: _rawSectors[1].yieldTarget, area: _rawSectors[1].luasHa + ' Ha' },
  { crop: _rawSectors[0].cropType, yield: _rawSectors[0].yieldCurrent, target: _rawSectors[0].yieldTarget, area: _rawSectors[0].luasHa + ' Ha' },
  { crop: _rawSectors[2].cropType, yield: _rawSectors[2].yieldCurrent, target: _rawSectors[2].yieldTarget, area: _rawSectors[2].luasHa + ' Ha' },
];

// Data detail per lahan — derived from mockMarkers (geospatial monitoring data)
const sectorDetailData = mockMarkers.map((m) => ({
  id: m.id.split('-')[1].toUpperCase(),
  name: m.title,
  luas: m.luasLahan,
  cropType: m.cropType,
  health: parseInt(m.plantHealth),
  position: m.position,
  soil: {
    ph: parseFloat(m.tanah.ph),
    moisture: parseInt(m.tanah.moisture),
    nitrogen: m.tanah.pupuk === 'Optimal' ? 95 : m.tanah.pupuk.includes('Kurang') ? 55 : m.tanah.pupuk.includes('Kritis') ? 30 : 70,
    organic: m.tanah.pupuk === 'Optimal' ? 88 : m.tanah.pupuk.includes('Kurang') ? 62 : m.tanah.pupuk.includes('Kritis') ? 25 : 78,
  },
  pest: {
    wereng: m.status === 'danger' ? 12 : m.status === 'warning' ? 5 : 0,
    ulat: m.status === 'danger' ? 8 : m.status === 'warning' ? 3 : 1,
    kutu: m.status === 'danger' ? 6 : m.status === 'warning' ? 4 : 0,
    belalang: m.status === 'danger' ? 4 : m.status === 'warning' ? 2 : 0,
  },
  water: {
    usage: m.status === 'danger' ? 180 : m.status === 'warning' ? 120 : 80,
    rainfall: m.status === 'danger' ? 10 : m.status === 'warning' ? 30 : 50,
    efficiency: m.status === 'danger' ? 35 : m.status === 'warning' ? 68 : 94,
  },
  yield: {
    current: m.status === 'danger' ? 2.1 : m.status === 'warning' ? 5.2 : 8.5,
    target: m.status === 'danger' ? 8.0 : m.status === 'warning' ? 6.0 : 8.0,
    unit: 'Ton',
  },
  finance: {
    revenue: parseInt(m.finansial.potensiKeuntungan.replace(/\D/g, '')) / 1000000,
    cost: parseInt(m.finansial.potensiRugi.replace(/\D/g, '')) / 1000000,
    profit: (parseInt(m.finansial.potensiKeuntungan.replace(/\D/g, '')) - parseInt(m.finansial.potensiRugi.replace(/\D/g, ''))) / 1000000,
  },
  alerts: {
    total: m.status === 'danger' ? 15 : m.status === 'warning' ? 8 : 2,
    resolved: m.status === 'danger' ? 8 : m.status === 'warning' ? 6 : 2,
    critical: m.status === 'danger' ? 5 : m.status === 'warning' ? 1 : 0,
  },
  status: m.status === 'danger' ? 'Kritis' : m.status === 'warning' ? 'Warning' : 'Optimal',
  trend: m.status === 'danger' ? 'down' : m.status === 'warning' ? 'down' : 'up',
  description: m.description,
  aiSaran: m.aiSaran,
}));

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
  const { logout, user } = useAuthStore();
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
            { id: 'users', label: 'Manajemen User', icon: Users, action: () => setActiveTab('users') },
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
          <div className="p-3 bg-blue-900/20 rounded-xl border border-blue-800/30 text-center">
            <p className="text-[8px] text-blue-400/50 font-bold uppercase tracking-widest">v2.6.0-PRO</p>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="relative flex-1 h-full overflow-hidden bg-[#0b1730] flex flex-col">

        {/* TOP NAVBAR */}
        <header className="h-14 bg-[#0d1f47] border-b border-blue-900/40 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-40">
          {/* Left: Page Title */}
          <div>
            <h2 className="text-sm font-black text-white uppercase font-cyber italic tracking-tight">
              {activeTab === 'monitoring' && 'MONITOR GEOSPASIAL'}
              {activeTab === 'analytics' && 'ANALITIK KESELURUHAN'}
              {activeTab === 'drones' && 'ANALISA ARMADA DRONE'}
              {activeTab === 'companies' && 'MANAJEMEN PERUSAHAAN'}
              {activeTab === 'users' && 'MANAJEMEN USER'}
            </h2>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 pr-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white truncate leading-tight">{user.name}</p>
                    <p className="text-[8px] text-emerald-400 font-black uppercase tracking-wider">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-emerald-500/20 flex-shrink-0">
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
        <div className="flex-1 overflow-hidden">
        
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
             <header className="mb-10">
               <div className="flex items-center gap-4 mb-2">
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-cyber italic">ANALITIK KESELURUHAN</h2>
                 <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1.5">
                   <Activity size={12} />
                   LIVE DATA
                 </span>
               </div>
               <p className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mt-1">Laporan Komprehensif Ekosistem Mahluk Hidup • Periode Juni 2026</p>
             </header>

             {/* ROW 1: KPI CARDS - 6 Metrics (computed from mockMarkers) */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                <Card className="hover:border-emerald-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform"><Coins size={18} /></div>
                     <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><ArrowUpRight size={10} />24%</span>
                   </div>
                   <div className="mt-3">
                     <p className="text-[8px] font-black text-blue-400/70 uppercase tracking-widest mb-0.5">Total Pendapatan</p>
                     <p className="text-lg font-black tracking-tighter text-white italic">Rp {totalRevenue.toFixed(0)}<span className="text-xs ml-0.5 text-blue-400/70 uppercase">Jt</span></p>
                   </div>
                </Card>
                <Card className="hover:border-sky-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-lg group-hover:scale-110 transition-transform"><Wheat size={18} /></div>
                     <span className="text-[9px] font-black text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><ArrowUpRight size={10} />18%</span>
                   </div>
                   <div className="mt-3">
                     <p className="text-[8px] font-black text-blue-400/70 uppercase tracking-widest mb-0.5">Total Panen</p>
                     <p className="text-lg font-black tracking-tighter text-white italic">{totalYield.toFixed(1)}<span className="text-xs ml-0.5 text-blue-400/70 uppercase">Ton</span></p>
                   </div>
                </Card>
                <Card className="hover:border-amber-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg group-hover:scale-110 transition-transform"><Layers size={18} /></div>
                     <span className="text-[9px] font-black text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded-full">{totalArea.toFixed(1)} Ha</span>
                   </div>
                   <div className="mt-3">
                     <p className="text-[8px] font-black text-blue-400/70 uppercase tracking-widest mb-0.5">Lahan Produktif</p>
                     <p className="text-lg font-black tracking-tighter text-white italic">{totalArea.toFixed(0)}<span className="text-xs ml-0.5 text-blue-400/70 uppercase">Ha</span></p>
                   </div>
                </Card>
                <Card className="hover:border-emerald-500/30 transition-all group bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-xl shadow-emerald-500/20" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-white/20 text-white rounded-lg group-hover:scale-110 transition-transform"><ShieldCheck size={18} /></div>
                     <span className="text-[9px] font-black text-emerald-100 bg-white/20 px-1.5 py-0.5 rounded-full">+2.1%</span>
                   </div>
                   <div className="mt-3">
                     <p className="text-[8px] font-black text-emerald-100 uppercase tracking-widest mb-0.5">Kesehatan Tanaman</p>
                     <p className="text-lg font-black tracking-tighter italic">{avgHealth}<span className="text-xs ml-0.5 text-emerald-200 uppercase">%</span></p>
                   </div>
                </Card>
                <Card className="hover:border-rose-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-lg group-hover:scale-110 transition-transform"><AlertOctagon size={18} /></div>
                     <span className="text-[9px] font-black text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><ArrowDownRight size={10} />67%</span>
                   </div>
                   <div className="mt-3">
                     <p className="text-[8px] font-black text-blue-400/70 uppercase tracking-widest mb-0.5">Total Alert</p>
                     <p className="text-lg font-black tracking-tighter text-white italic">{totalAlerts}<span className="text-xs ml-0.5 text-blue-400/70 uppercase">Events</span></p>
                   </div>
                </Card>
                <Card className="hover:border-blue-500/30 transition-all group" padding={true}>
                   <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><Eye size={18} /></div>
                     <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full">{Math.round((totalResolved / totalAlerts) * 100)}%</span>
                   </div>
                   <div className="mt-3">
                     <p className="text-[8px] font-black text-blue-400/70 uppercase tracking-widest mb-0.5">Resolusi Rate</p>
                     <p className="text-lg font-black tracking-tighter text-white italic">{totalResolved}/{totalAlerts}<span className="text-xs ml-0.5 text-blue-400/70 uppercase">Resolved</span></p>
                   </div>
                </Card>
             </div>

             {/* ROW 1.5: DETAIL PER LAHAN */}
             <div className="mb-8">
               <div className="flex items-center gap-3 mb-4">
                 <MapPin size={16} className="text-emerald-400" />
                 <h3 className="font-black text-sm tracking-widest uppercase text-white italic">Detail per Lahan</h3>
                 <span className="text-[9px] font-bold text-blue-400/60 uppercase tracking-wider">Breakdown 4 Sektor • 44.0 Ha Total</span>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 {sectorDetailData.map((sector) => (
                   <Card key={sector.id} className="hover:border-emerald-500/30 transition-all" padding={false}>
                     {/* Header */}
                     <div className={`p-5 border-b ${
                       sector.status === 'Optimal' ? 'border-emerald-500/20 bg-emerald-500/5' :
                       sector.status === 'Baik' ? 'border-sky-500/20 bg-sky-500/5' :
                       sector.status === 'Warning' ? 'border-amber-500/20 bg-amber-500/5' :
                       'border-red-500/20 bg-red-500/5'
                     }`}>
                       <div className="flex items-start justify-between gap-4">
                         <div className="flex items-start gap-3 flex-1">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                             sector.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                             sector.status === 'Baik' ? 'bg-sky-500/20 text-sky-400' :
                             sector.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                             'bg-red-500/20 text-red-400'
                           }`}>
                             {sector.id}
                           </div>
                           <div className="flex-1">
                             <h4 className="text-sm font-black text-white uppercase font-cyber italic">{sector.name}</h4>
                             <div className="flex items-center gap-3 mt-1">
                               <span className="text-[9px] text-blue-400/60 font-bold">{sector.luas}</span>
                               <span className="text-[9px] text-blue-400/60 font-bold">•</span>
                               <span className="text-[9px] text-blue-400/60 font-bold">{sector.cropType}</span>
                             </div>
                           </div>
                         </div>
                         <div className="text-right flex flex-col items-end gap-1">
                           <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                             sector.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                             sector.status === 'Baik' ? 'bg-sky-500/20 text-sky-400' :
                             sector.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                             'bg-red-500/20 text-red-400'
                           }`}>{sector.status}</span>
                           <div className="flex items-center gap-1">
                             {sector.trend === 'up' ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                             <span className={`text-[9px] font-black ${sector.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                               {sector.health}%
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Content Grid */}
                     <div className="p-5 grid grid-cols-2 gap-4">
                       {/* Tanah */}
                       <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                         <div className="flex items-center gap-1.5 mb-2">
                           <FlaskConical size={12} className="text-amber-400" />
                           <span className="text-[8px] font-black text-blue-400/60 uppercase tracking-wider">Tanah</span>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">pH</span>
                             <span className={`font-black ${sector.soil.ph >= 6 ? 'text-emerald-400' : sector.soil.ph >= 5.5 ? 'text-amber-400' : 'text-red-400'}`}>{sector.soil.ph}</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Kelembapan</span>
                             <span className={`font-black ${sector.soil.moisture >= 60 ? 'text-emerald-400' : sector.soil.moisture >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{sector.soil.moisture}%</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Nitrogen</span>
                             <span className={`font-black ${sector.soil.nitrogen >= 80 ? 'text-emerald-400' : sector.soil.nitrogen >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{sector.soil.nitrogen}%</span>
                           </div>
                         </div>
                       </div>

                       {/* Hama */}
                       <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                         <div className="flex items-center gap-1.5 mb-2">
                           <Bug size={12} className="text-red-400" />
                           <span className="text-[8px] font-black text-blue-400/60 uppercase tracking-wider">Hama</span>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Wereng</span>
                             <span className={`font-black ${sector.pest.wereng === 0 ? 'text-emerald-400' : sector.pest.wereng > 5 ? 'text-red-400' : 'text-amber-400'}`}>{sector.pest.wereng}</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Ulat</span>
                             <span className={`font-black ${sector.pest.ulat === 0 ? 'text-emerald-400' : sector.pest.ulat > 5 ? 'text-red-400' : 'text-amber-400'}`}>{sector.pest.ulat}</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Kutu</span>
                             <span className={`font-black ${sector.pest.kutu === 0 ? 'text-emerald-400' : sector.pest.kutu > 5 ? 'text-red-400' : 'text-amber-400'}`}>{sector.pest.kutu}</span>
                           </div>
                         </div>
                       </div>

                       {/* Air */}
                       <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                         <div className="flex items-center gap-1.5 mb-2">
                           <Droplet size={12} className="text-cyan-400" />
                           <span className="text-[8px] font-black text-blue-400/60 uppercase tracking-wider">Air</span>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Pemakaian</span>
                             <span className="font-black text-white">{sector.water.usage} m³</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Hujan</span>
                             <span className="font-black text-indigo-400">{sector.water.rainfall} mm</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Efisiensi</span>
                             <span className={`font-black ${sector.water.efficiency >= 80 ? 'text-emerald-400' : sector.water.efficiency >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{sector.water.efficiency}%</span>
                           </div>
                         </div>
                       </div>

                       {/* Keuangan */}
                       <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                         <div className="flex items-center gap-1.5 mb-2">
                           <Coins size={12} className="text-emerald-400" />
                           <span className="text-[8px] font-black text-blue-400/60 uppercase tracking-wider">Keuangan</span>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Pendapatan</span>
                             <span className="font-black text-emerald-400">Rp {sector.finance.revenue}jt</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Biaya</span>
                             <span className="font-black text-amber-400">Rp {sector.finance.cost}jt</span>
                           </div>
                           <div className="flex justify-between text-[9px]">
                             <span className="text-slate-400 font-bold">Profit</span>
                             <span className={`font-black ${sector.finance.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Rp {sector.finance.profit}jt</span>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Footer: Yield + Alerts */}
                     <div className={`px-5 py-3 border-t flex items-center justify-between gap-4 ${
                       sector.status === 'Optimal' ? 'border-emerald-500/20' :
                       sector.status === 'Baik' ? 'border-sky-500/20' :
                       sector.status === 'Warning' ? 'border-amber-500/20' :
                       'border-red-500/20'
                     }`}>
                       <div className="flex items-center gap-3 flex-1">
                         <div className="flex-1">
                           <div className="flex items-center justify-between text-[8px] mb-1">
                             <span className="text-blue-400/60 font-black uppercase">Hasil Panen</span>
                             <span className="text-white font-black">{sector.yield.current}/{sector.yield.target} {sector.yield.unit}</span>
                           </div>
                           <div className="h-1.5 bg-blue-900/40 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${sector.yield.current >= sector.yield.target ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((sector.yield.current / sector.yield.target) * 100, 100)}%` }} />
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 text-[9px]">
                         <span className="flex items-center gap-1 font-bold text-blue-400/60">
                           <AlertTriangle size={10} />
                           {sector.alerts.total} alert{sector.alerts.total > 1 ? 's' : ''}
                         </span>
                         <span className={`font-black ${sector.alerts.critical > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                           {sector.alerts.resolved}/{sector.alerts.total} resolved
                         </span>
                       </div>
                     </div>
                   </Card>
                 ))}
               </div>
             </div>

             {/* ROW 2: Revenue Trend + Crop Distribution */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
               <Card className="lg:col-span-2 shadow-xl" padding={true}>
                 <div className="mb-4 flex justify-between items-center">
                   <div>
                     <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-emerald-500/30">Tren Pendapatan & Panen</h3>
                     <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Data 6 Bulan Terakhir</p>
                   </div>
                   <div className="flex items-center gap-4 text-[9px] font-bold">
                     <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Pendapatan (Juta)</span>
                     <span className="flex items-center gap-1 text-sky-400"><span className="w-2 h-2 rounded-full bg-sky-500" /> Panen (Ton)</span>
                   </div>
                 </div>
                 <div className="h-[280px] w-full">
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
                       <CartesianGrid vertical={false} stroke="#1e3a5f" strokeDasharray="3 3" />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Area type="monotone" dataKey="revenue" name="Pendapatan (Juta)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                       <Area type="monotone" dataKey="yield" name="Panen (Ton)" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </Card>
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-2">
                   <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-sky-500/30">Distribusi Tanaman</h3>
                   <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Komposisi Ekosistem</p>
                 </div>
                 <div className="h-[200px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={cropDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                         {cropDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                       <RechartsTooltip content={<CustomTooltip />} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="space-y-2 mt-2">
                   {cropDistributionData.map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-[9px]">
                       <span className="flex items-center gap-1.5 font-bold text-slate-300">
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         {item.name}
                       </span>
                       <span className="font-black text-white">{item.value}%</span>
                     </div>
                   ))}
                 </div>
               </Card>
             </div>

             {/* ROW 3: Soil Quality + Pest Detection */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-4 flex justify-between items-center">
                   <div>
                     <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-amber-500/30">Kualitas Tanah</h3>
                     <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Tren pH, Kelembapan & Nitrogen</p>
                   </div>
                   <FlaskConical size={18} className="text-amber-400" />
                 </div>
                 <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={soilQualityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid vertical={false} stroke="#1e3a5f" strokeDasharray="3 3" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} width={50} />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Line type="monotone" dataKey="ph" name="pH Tanah" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                       <Line type="monotone" dataKey="moisture" name="Kelembapan (%)" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
                       <Line type="monotone" dataKey="nitrogen" name="Nitrogen (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               </Card>

               <Card className="shadow-xl" padding={true}>
                 <div className="mb-4 flex justify-between items-center">
                   <div>
                     <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-red-500/30">Deteksi Hama</h3>
                     <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Insiden per Bulan</p>
                   </div>
                   <Bug size={18} className="text-red-400" />
                 </div>
                 <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsBarChart data={pestDetectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid vertical={false} stroke="#1e3a5f" strokeDasharray="3 3" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} width={50} />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Bar dataKey="wereng" name="Wereng" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="ulat" name="Ulat" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="kutu" name="Kutu Daun" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="belalang" name="Belalang" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                     </RechartsBarChart>
                   </ResponsiveContainer>
                 </div>
               </Card>
             </div>

             {/* ROW 4: Water Usage + Sector Performance */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-4 flex justify-between items-center">
                   <div>
                     <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-cyan-500/30">Penggunaan Air Irigasi</h3>
                     <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Volume vs Curah Hujan (m³)</p>
                   </div>
                   <Droplet size={18} className="text-cyan-400" />
                 </div>
                 <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsBarChart data={waterUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid vertical={false} stroke="#1e3a5f" strokeDasharray="3 3" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} width={50} />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Bar dataKey="usage" name="Penggunaan Air" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                       <Bar dataKey="rainfall" name="Curah Hujan" fill="#6366f1" radius={[4, 4, 0, 0]} />
                     </RechartsBarChart>
                   </ResponsiveContainer>
                 </div>
               </Card>

               {/* SECTOR PERFORMANCE TABLE */}
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-4">
                   <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-emerald-500/30">Performa per Sektor</h3>
                   <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Rating Kesehatan & Produktivitas</p>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-[10px]">
                     <thead>
                       <tr className="border-b border-blue-800/30 text-blue-400/70 uppercase tracking-wider">
                         <th className="text-left py-2 font-black">Sektor</th>
                         <th className="text-center py-2 font-black">Kesehatan</th>
                         <th className="text-center py-2 font-black">Yield (Ton)</th>
                         <th className="text-center py-2 font-black">Profit (Juta)</th>
                         <th className="text-center py-2 font-black">Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {sectorPerformanceData.map((sector, i) => (
                         <tr key={i} className="border-b border-blue-900/20 hover:bg-blue-900/10 transition-colors">
                           <td className="py-2.5 font-bold text-white">{sector.sector}</td>
                           <td className="text-center py-2.5">
                             <div className="flex items-center justify-center gap-1.5">
                               <div className="w-12 h-1.5 bg-blue-900/40 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${sector.health > 80 ? 'bg-emerald-500' : sector.health > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sector.health}%` }} />
                               </div>
                               <span className={`font-black ${sector.health > 80 ? 'text-emerald-400' : sector.health > 60 ? 'text-amber-400' : 'text-red-400'}`}>{sector.health}%</span>
                             </div>
                           </td>
                           <td className="text-center py-2.5 font-bold text-white">{sector.yield}</td>
                           <td className="text-center py-2.5 font-bold text-emerald-400">{sector.profit}</td>
                           <td className="text-center py-2.5">
                             <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                               sector.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                               sector.status === 'Baik' ? 'bg-sky-500/20 text-sky-400' :
                               sector.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                               'bg-red-500/20 text-red-400'
                             }`}>{sector.status}</span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </Card>
             </div>

             {/* ROW 5: Alerts + Crop Yield vs Target */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-4 flex justify-between items-center">
                   <div>
                     <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-orange-500/30">Alert Bulanan</h3>
                     <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Terdeteksi vs Terselesaikan</p>
                   </div>
                   <Clock size={18} className="text-orange-400" />
                 </div>
                 <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsBarChart data={monthlyAlertsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid vertical={false} stroke="#1e3a5f" strokeDasharray="3 3" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} width={50} />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Bar dataKey="alerts" name="Alert Terdeteksi" fill="#ef4444" radius={[4, 4, 0, 0]} />
                       <Bar dataKey="resolved" name="Terselesaikan" fill="#10b981" radius={[4, 4, 0, 0]} />
                     </RechartsBarChart>
                   </ResponsiveContainer>
                 </div>
               </Card>

               {/* CROP YIELD VS TARGET */}
               <Card className="shadow-xl" padding={true}>
                 <div className="mb-4">
                   <h3 className="font-black text-xs tracking-widest uppercase text-white italic underline decoration-green-500/30">Hasil Panen vs Target</h3>
                   <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Pencapaian per Komoditas</p>
                 </div>
                 <div className="space-y-4">
                   {cropYieldByType.map((item, i) => {
                     const achievement = Math.round((item.yield / item.target) * 100);
                     const isAboveTarget = achievement >= 100;
                     return (
                       <div key={i} className="p-3 bg-blue-900/20 rounded-xl border border-blue-800/30">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <Wheat size={14} className="text-emerald-400" />
                             <span className="text-[10px] font-bold text-white">{item.crop}</span>
                           </div>
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isAboveTarget ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                             {achievement}%
                           </span>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="flex-1 h-2 bg-blue-900/40 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${isAboveTarget ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(achievement, 100)}%` }} />
                           </div>
                           <span className="text-[9px] font-bold text-slate-400 w-16 text-right">{item.yield}/{item.target} Ton</span>
                         </div>
                         <p className="text-[8px] text-blue-400/60 mt-1 font-bold">Area: {item.area}</p>
                       </div>
                     );
                   })}
                 </div>
               </Card>
             </div>

             {/* ROW 6: AI Insights Summary */}
             <Card className="shadow-xl mb-8 bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-700/30" padding={true}>
               <div className="flex items-start gap-4 mb-4">
                 <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg"><Sparkles size={24} className="animate-pulse" /></div>
                 <div>
                   <h3 className="font-black text-sm tracking-widest uppercase text-white italic">Insights AI Agronom</h3>
                   <p className="text-[9px] text-blue-400/70 mt-1 uppercase font-bold">Rekomendasi Otomatis Berdasarkan Data Real-time</p>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                   <div className="flex items-center gap-2 mb-2">
                     <CheckCircle2 size={14} className="text-emerald-400" />
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Optimal</span>
                   </div>
                   <p className="text-xs font-bold text-slate-300 leading-relaxed">Sektor A (Ciwidey) menunjukkan performa terbaik. Pertahankan jadwal irigasi dan pemupukan saat ini untuk hasil maksimal.</p>
                 </div>
                 <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertTriangle size={14} className="text-amber-400" />
                     <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Perhatian</span>
                   </div>
                   <p className="text-xs font-bold text-slate-300 leading-relaxed">Sektor B (Lembang) butuh penambahan nitrogen 15%. Jadwalkan pemupukan ulang dalam 3 hari ke depan untuk mencegah penurunan hasil.</p>
                 </div>
                 <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertOctagon size={14} className="text-red-400" />
                     <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">Kritis</span>
                   </div>
                   <p className="text-xs font-bold text-slate-300 leading-relaxed">Sektor C (Subang) memerlukan intervensi segera: penyemprotan hama + peningkatan irigasi 40%. Estimasi kerugian Rp 380jt jika tidak ditangani.</p>
                 </div>
               </div>
             </Card>
          </div>
        )}

        {/* TAB 3: ANALISA DRONE */}
        {activeTab === 'drones' && (
          <div className="p-10 h-full overflow-y-auto custom-scrollbar bg-[#0b1730]">
             <header className="mb-10">
               <div className="flex items-center gap-4 mb-2">
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-cyber italic">ANALISA ARMADA DRONE</h2>
                 <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                   </svg>
                   PRO
                 </span>
               </div>
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

        {/* TAB 5: MANAJEMEN USER */}
        {activeTab === 'users' && (
          <UserManagement />
        )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
