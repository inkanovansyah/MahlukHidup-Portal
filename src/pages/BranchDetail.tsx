import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Phone, Mail, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardLayout from '../components/DashboardLayout';
import type { BranchDto } from '../types/company.types';

// Mock data (sama dengan di CompanyManagement)
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

const BranchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const branch = mockBranches.find(b => b.id === id);

  if (!branch) {
    return (
      <div className="p-4 md:p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar bg-slate-50">
        <Card className="text-center py-16">
          <Building size={48} className="mx-auto text-slate-500 mb-4" />
          <p className="text-lg font-bold text-slate-500">Cabang tidak ditemukan</p>
          <Button variant="primary" size="sm" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft size={16} />
            Kembali
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout pageTitle="DETAIL CABANG">
      <div className="p-4 md:p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase font-cyber italic">
            DETAIL CABANG
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            Informasi lengkap perusahaan cabang
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Edit2 size={16} />
            Edit
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 size={16} />
            Hapus
          </Button>
        </div>
      </div>

      {/* Header Info Card */}
      <Card className="mb-6 border-2 border-amber-500/30" padding={false}>
        <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Building size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-slate-800 uppercase">{branch.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  branch.isActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'
                }`}>
                  {branch.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-bold">Kode: {branch.code}</p>
              <p className="text-xs text-slate-500 mt-1">{branch.companyName}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card padding={false}>
          <div className="p-4 border-b border-slate-200 bg-slate-100">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Building size={16} />
              Informasi Kontak
            </h4>
          </div>
          <div className="p-4 space-y-3">
            {branch.address && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Alamat</p>
                <p className="text-sm text-slate-800 font-bold">{branch.address}</p>
              </div>
            )}
            {branch.phone && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Telepon</p>
                <p className="text-sm text-slate-800 font-bold flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  {branch.phone}
                </p>
              </div>
            )}
            {branch.email && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Email</p>
                <p className="text-sm text-slate-800 font-bold flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  {branch.email}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Location */}
        {(branch.latitude || branch.longitude) && (
          <Card padding={false}>
            <div className="p-4 border-b border-slate-200 bg-slate-100">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} />
                Lokasi Koordinat
              </h4>
            </div>
            <div className="p-4">
              <div className="p-6 bg-blue-500/5 border-2 border-blue-500/20 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-2">Latitude</p>
                    <p className="text-2xl font-black text-blue-600">{branch.latitude?.toFixed(6)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-2">Longitude</p>
                    <p className="text-2xl font-black text-blue-600">{branch.longitude?.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* System Information */}
      <Card className="mt-6" padding={false}>
        <div className="p-4 border-b border-slate-200 bg-slate-100">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={16} />
            Informasi Sistem
          </h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Company ID</p>
              <p className="text-xs text-slate-800 font-mono font-bold">{branch.companyId}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Branch ID</p>
              <p className="text-xs text-slate-800 font-mono font-bold">{branch.id}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Tanggal Dibuat</p>
              <p className="text-sm text-slate-800 font-bold">
                {new Date(branch.createDate).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Status</p>
              <p className={`text-sm font-black ${branch.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                {branch.isActive ? '✓ Aktif' : '✗ Nonaktif'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default BranchDetail;
