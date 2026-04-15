import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Plus, Edit2, Trash2, X, Check,
  Search, AlertCircle, Building, Eye,
  Users, TrendingUp, TrendingDown, DollarSign, Sprout,
  Phone, Mail, User, Briefcase, Calendar,
  BarChart3, AlertTriangle
} from 'lucide-react';
import { branchApi } from '../api/company.api';
import type { BranchDto, BranchCreateDto } from '../types/company.types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

// Mock data untuk company utama (hanya 1, tidak bisa ditambah)
const mockMainCompany = {
  id: 'company-001',
  name: 'PT MAHLUK HIDUP AGRICULTURE',
  code: 'MHA-001',
  description: 'Perusahaan pertanian berbasis teknologi AI dan drone untuk monitoring serta optimalisasi hasil panen',
  address: 'Jl. Pertanian Modern No. 123, Bandung, Jawa Barat',
  phone: '+62 812-3456-7890',
  email: 'info@mahlukhidup.com',
  isActive: true,
  createDate: '2025-01-01T00:00:00Z',
};

// Mock data cabang dari Monitor Geospasial (Sektor A, B, C)
const mockBranches: BranchDto[] = [
  {
    id: 'branch-sec-a',
    companyId: 'company-001',
    companyName: 'PT MAHLUK HIDUP AGRICULTURE',
    name: 'Sektor A - Ciwidey',
    code: 'SEC-A-001',
    address: 'Ciwidey, Kabupaten Bandung, Jawa Barat',
    phone: '+62 821-1234-5001',
    email: 'ciwidey@mahlukhidup.com',
    latitude: -6.9147,
    longitude: 107.6098,
    isActive: true,
    createDate: '2025-01-15T08:00:00Z'
  },
  {
    id: 'branch-sec-b',
    companyId: 'company-001',
    companyName: 'PT MAHLUK HIDUP AGRICULTURE',
    name: 'Sektor B - Lembang',
    code: 'SEC-B-002',
    address: 'Lembang, Kabupaten Bandung Barat, Jawa Barat',
    phone: '+62 821-1234-5002',
    email: 'lembang@mahlukhidup.com',
    latitude: -6.8247,
    longitude: 107.6198,
    isActive: true,
    createDate: '2025-02-20T09:30:00Z'
  },
  {
    id: 'branch-sec-c',
    companyId: 'company-001',
    companyName: 'PT MAHLUK HIDUP AGRICULTURE',
    name: 'Sektor C - Subang',
    code: 'SEC-C-003',
    address: 'Subang, Kabupaten Subang, Jawa Barat',
    phone: '+62 821-1234-5003',
    email: 'subang@mahlukhidup.com',
    latitude: -6.9547,
    longitude: 107.6598,
    isActive: true,
    createDate: '2025-03-10T07:15:00Z'
  },
];

// Analytics summary mock data (dari dashboard analytics)
const mockAnalyticsSummary = {
  totalRevenue: 850000000,
  totalLoss: 430000000,
  netProfit: 420000000,
  profitMargin: 49.4,
  totalArea: 35.7,
  avgHealth: 71,
  totalSectors: 3,
  yieldPerSector: [
    { sector: 'Sektor A - Ciwidey', yield: 8.5, target: 8.0, profit: 445000000, status: 'optimal' },
    { sector: 'Sektor B - Lembang', yield: 5.2, target: 6.0, profit: 235000000, status: 'warning' },
    { sector: 'Sektor C - Subang', yield: 2.1, target: 8.0, profit: -260000000, status: 'danger' },
  ],
  lossReasons: [
    { reason: 'Serangan wereng coklat (Sektor C)', impact: 'Rp 280.000.000', severity: 'high' },
    { reason: 'Kekeringan akut & curah hujan rendah', impact: 'Rp 100.000.000', severity: 'high' },
    { reason: 'Penurunan nitrogen tanah (Sektor B)', impact: 'Rp 50.000.000', severity: 'medium' },
  ],
};

const mockEmployeesCount = 127;

const CompanyManagement = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<BranchDto[]>(mockBranches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectorPage, setSectorPage] = useState(1);
  const branchesItemsPerPage = 6;
  const sectorItemsPerPage = 5;
  const [branchForm, setBranchForm] = useState<BranchCreateDto>({
    companyId: mockMainCompany.id,
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    latitude: undefined,
    longitude: undefined
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await branchApi.getBranchesByCompany(mockMainCompany.id);
      setBranches(data);
      setError(null);
    } catch (err: any) {
      setBranches([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBranches.length / branchesItemsPerPage);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * branchesItemsPerPage,
    currentPage * branchesItemsPerPage
  );

  // Sector pagination
  const totalSectorPages = Math.ceil(mockAnalyticsSummary.yieldPerSector.length / sectorItemsPerPage);
  const paginatedSectors = mockAnalyticsSummary.yieldPerSector.slice(
    (sectorPage - 1) * sectorItemsPerPage,
    sectorPage * sectorItemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (branch: BranchDto) => {
    navigate(`/branch/${branch.id}`);
  };

  const handleOpenBranchModal = (branch?: BranchDto) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchForm({
        companyId: mockMainCompany.id,
        name: branch.name,
        code: branch.code,
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        latitude: branch.latitude,
        longitude: branch.longitude
      });
    } else {
      setEditingBranch(null);
      setBranchForm({
        companyId: mockMainCompany.id,
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        latitude: undefined,
        longitude: undefined
      });
    }
    setShowBranchModal(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await branchApi.updateBranch(editingBranch.id, branchForm);
      } else {
        await branchApi.createBranch(branchForm);
      }
      setShowBranchModal(false);
      fetchBranches();
    } catch (err: any) {
      const newBranch: BranchDto = {
        id: editingBranch ? editingBranch.id : `branch-${Date.now()}`,
        companyId: mockMainCompany.id,
        companyName: mockMainCompany.name,
        name: branchForm.name,
        code: branchForm.code,
        address: branchForm.address,
        phone: branchForm.phone,
        email: branchForm.email,
        latitude: branchForm.latitude,
        longitude: branchForm.longitude,
        isActive: true,
        createDate: new Date().toISOString()
      };
      
      if (editingBranch) {
        setBranches(branches.map(b => b.id === editingBranch.id ? newBranch : b));
      } else {
        setBranches([...branches, newBranch]);
      }
      setShowBranchModal(false);
      setError(null);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Yakin ingin menghapus perusahaan cabang ini?')) return;
    try {
      await branchApi.deleteBranch(id);
      fetchBranches();
    } catch (err: any) {
      setBranches(branches.filter(b => b.id !== id));
      setError(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout pageTitle="MANAJEMEN PERUSAHAAN">
      <div className="p-4 md:p-6 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase font-cyber italic">
          INFORMASI PERUSAHAAN
        </h2>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          Data Perusahaan Utama dan Performance Summary
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300 font-bold">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* COMPANY PROFILE CARD */}
      <Card className="mb-4 border-2 border-blue-500/30" padding={false}>
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-sky-500/10 border-b border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Building2 size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-slate-800 uppercase font-cyber italic">
                  {mockMainCompany.name}
                </h3>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-600 border border-blue-500/30">
                  PERUSAHAAN UTAMA
                </span>
              </div>
              <p className="text-sm text-slate-600 italic mb-3">{mockMainCompany.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase size={14} className="text-slate-400" />
                  <span className="font-bold">Bidang:</span>
                  <span>Pertanian & Teknologi AI</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={14} className="text-slate-400" />
                  <span className="font-bold">Owner:</span>
                  <span>Inka Novansyah</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  <span>{mockMainCompany.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{mockMainCompany.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 md:col-span-2">
                  <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{mockMainCompany.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={14} className="text-slate-400" />
                  <span>Berdiri:</span>
                  <span>{new Date(mockMainCompany.createDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users size={14} className="text-slate-400" />
                  <span>Total Karyawan:</span>
                  <span className="font-black text-blue-600">{mockEmployeesCount} orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="hover:border-emerald-500/30 transition-all border-2 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Pendapatan</p>
              <p className="text-lg font-black text-emerald-600">{formatCurrency(mockAnalyticsSummary.totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:border-red-500/30 transition-all border-2 border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 text-red-600 rounded-xl">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Kerugian</p>
              <p className="text-lg font-black text-red-600">{formatCurrency(mockAnalyticsSummary.totalLoss)}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:border-blue-500/30 transition-all border-2 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 text-blue-600 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Keuntungan Bersih</p>
              <p className="text-lg font-black text-blue-600">{formatCurrency(mockAnalyticsSummary.netProfit)}</p>
              <p className="text-[9px] font-bold text-slate-500">Margin: {mockAnalyticsSummary.profitMargin}%</p>
            </div>
          </div>
        </Card>

        <Card className="hover:border-amber-500/30 transition-all border-2 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-600 rounded-xl">
              <Sprout size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Lahan</p>
              <p className="text-lg font-black text-amber-600">{mockAnalyticsSummary.totalArea} Ha</p>
              <p className="text-[9px] font-bold text-slate-500">Health: {mockAnalyticsSummary.avgHealth}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTOR PERFORMANCE & LOSS REASONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Sector Performance */}
        <Card padding={false}>
          <div className="p-4 border-b border-slate-200 bg-slate-100">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={16} />
              Performance Per Sektor
            </h4>
          </div>
          <div className="p-4 space-y-3">
            {paginatedSectors.map((sector, idx) => (
              <div key={idx} className={`p-3 rounded-xl border-2 ${
                sector.status === 'optimal' ? 'border-emerald-500/30 bg-emerald-500/5' :
                sector.status === 'warning' ? 'border-amber-500/30 bg-amber-500/5' :
                'border-red-500/30 bg-red-500/5'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-black text-slate-800">{sector.sector}</h5>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    sector.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-600' :
                    sector.status === 'warning' ? 'bg-amber-500/20 text-amber-600' :
                    'bg-red-500/20 text-red-600'
                  }`}>
                    {sector.status === 'optimal' ? 'OPTIMAL' : sector.status === 'warning' ? 'WARNING' : 'KRITIS'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase">Hasil</p>
                    <p className="font-black text-slate-800">{sector.yield} Ton</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase">Target</p>
                    <p className="font-bold text-slate-600">{sector.target} Ton</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase">Profit</p>
                    <p className={`font-black ${sector.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(sector.profit)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Sector Pagination */}
            {totalSectorPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSectorPage(sectorPage - 1)}
                  disabled={sectorPage === 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  ← Prev
                </button>
                
                {Array.from({ length: totalSectorPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setSectorPage(page)}
                    className={`w-8 h-8 text-xs font-black rounded-lg transition-all ${
                      page === sectorPage
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setSectorPage(sectorPage + 1)}
                  disabled={sectorPage === totalSectorPages}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Loss Reasons */}
        <Card padding={false}>
          <div className="p-4 border-b border-slate-200 bg-slate-100">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Analisis Kerugian
            </h4>
            <p className="text-[9px] text-slate-500 mt-1">Kenapa tidak untung dan berapa kerugian</p>
          </div>
          <div className="p-4 space-y-3">
            {mockAnalyticsSummary.lossReasons.map((reason, idx) => (
              <div key={idx} className={`p-3 rounded-xl border-2 ${
                reason.severity === 'high' ? 'border-red-500/30 bg-red-500/5' :
                'border-amber-500/30 bg-amber-500/5'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={12} className={`flex-shrink-0 ${
                        reason.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                      }`} />
                      <p className="text-xs font-bold text-slate-800">{reason.reason}</p>
                    </div>
                    <p className="text-[9px] text-slate-500">Dampak kerugian:</p>
                  </div>
                  <p className={`text-sm font-black whitespace-nowrap ${
                    reason.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {reason.impact}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-amber-500/10 border-2 border-red-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-800 mb-1">TOTAL KERUGIAN: {formatCurrency(mockAnalyticsSummary.totalLoss)}</p>
                  <p className="text-[9px] text-slate-600">
                    Kerugian terutama disebabkan oleh serangan hama di Sektor C (wereng coklat) dan kondisi kekeringan yang menurunkan hasil panen hingga 73% dari target.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* BRANCHES MANAGEMENT SECTION */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 uppercase font-cyber italic">
              PERUSAHAAN CABANG
            </h3>
            <p className="text-xs text-slate-500">Kelola cabang-cabang perusahaan</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenBranchModal()}
          >
            <Plus size={16} />
            Tambah Cabang
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
            <Input
              type="text"
              placeholder="Cari cabang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
            />
          </div>
        </div>

        {/* Branches List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/30 border-t-emerald-500" />
          </div>
        ) : filteredBranches.length === 0 ? (
          <Card className="text-center py-16">
            <Building size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-lg font-bold text-slate-500">Belum ada perusahaan cabang</p>
            <p className="text-sm text-slate-500 mt-2">Klik "Tambah Cabang" untuk memulai</p>
          </Card>
        ) : (
          <div>
            {/* Branch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {paginatedBranches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onEdit={() => handleOpenBranchModal(branch)}
                  onDelete={() => handleDeleteBranch(branch.id)}
                  onViewDetail={() => handleViewDetail(branch)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl">
                <p className="text-xs text-slate-600 font-bold">
                  Menampilkan {((currentPage - 1) * branchesItemsPerPage) + 1} - {Math.min(currentPage * branchesItemsPerPage, filteredBranches.length)} dari {filteredBranches.length} cabang
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    ← Prev
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 text-xs font-black rounded-lg transition-all ${
                        page === currentPage
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

      {/* Branch Modal */}
      <Dialog open={showBranchModal} onOpenChange={setShowBranchModal}>
        <DialogContent className="max-w-2xl bg-white border border-blue-800/40 text-slate-800 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-black text-slate-800 uppercase font-cyber italic">
              {editingBranch ? 'Edit Perusahaan Cabang' : 'Tambah Perusahaan Cabang'}
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-1">
              Tambah cabang baru di bawah perusahaan utama
            </p>
          </DialogHeader>
          <form onSubmit={handleSaveBranch} className="space-y-4 px-4 md:px-6 pb-2">
            <FormField label="Nama Cabang" required>
              <Input
                type="text"
                value={branchForm.name}
                onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                required
              />
            </FormField>

            <FormField label="Kode" required>
              <Input
                type="text"
                value={branchForm.code}
                onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                required
                disabled={!!editingBranch}
              />
            </FormField>

            <FormField label="Alamat">
              <textarea
                value={branchForm.address || ''}
                onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                rows={2}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email">
                <Input
                  type="email"
                  value={branchForm.email || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                />
              </FormField>

              <FormField label="Telepon">
                <Input
                  type="text"
                  value={branchForm.phone || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Latitude">
                <Input
                  type="number"
                  step="any"
                  value={branchForm.latitude || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                />
              </FormField>

              <FormField label="Longitude">
                <Input
                  type="number"
                  step="any"
                  value={branchForm.longitude || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full bg-slate-800/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                />
              </FormField>
            </div>

            <DialogFooter className="flex gap-3 pt-4 sm:flex-row">
              <Button type="button" variant="ghost" fullWidth onClick={() => setShowBranchModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                <Check size={16} />
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const BranchCard = ({ branch, onEdit, onDelete, onViewDetail }: { branch: BranchDto; onEdit: () => void; onDelete: () => void; onViewDetail: () => void }) => {
  return (
    <div className={`group p-5 bg-white rounded-xl border-2 ${branch.isActive ? 'border-amber-500/30 hover:border-amber-500/60' : 'border-red-800/30 opacity-60'} transition-all hover:shadow-lg cursor-pointer`} onClick={onViewDetail}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <Building size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h5 className="text-sm font-black text-slate-800 truncate">{branch.name}</h5>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                branch.isActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'
              }`}>
                {branch.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold">Kode: {branch.code}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        {branch.address && (
          <p className="text-xs text-slate-600 line-clamp-2 flex items-start gap-1">
            <MapPin size={12} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="truncate">{branch.address}</span>
          </p>
        )}
        {(branch.phone || branch.email) && (
          <div className="flex gap-3 text-xs text-slate-600">
            {branch.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} className="text-slate-400" />
                {branch.phone}
              </span>
            )}
            {branch.email && (
              <span className="flex items-center gap-1 truncate">
                <Mail size={12} className="text-slate-400" />
                {branch.email}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
          className="flex-1 px-2 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-600 text-xs font-bold flex items-center justify-center gap-1"
          title="Detail"
        >
          <Eye size={12} />
          Detail
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-600 text-xs font-bold flex items-center justify-center gap-1"
          title="Edit"
        >
          <Edit2 size={12} />
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-600 text-xs font-bold flex items-center justify-center gap-1"
          title="Hapus"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
};

export default CompanyManagement;
