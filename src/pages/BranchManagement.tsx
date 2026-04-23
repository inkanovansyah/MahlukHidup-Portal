import { useState } from 'react';
import {
  Building2, Plus, Edit2, Trash2, Search,
  AlertCircle, MapPin, Phone, Mail, LayoutDashboard
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/input';

const mockBranches = [
  { id: '1', name: 'PT Utama (Pusat)', code: 'HQ-001', isMaster: true, address: 'Jakarta Selatan', phone: '021-123456', email: 'hq@malesgerak.com' },
  { id: '2', name: 'Cabang Bandung', code: 'BGD-001', isMaster: false, address: 'Bandung Kota', phone: '022-654321', email: 'bdg@malesgerak.com' },
  { id: '3', name: 'Cabang Surabaya', code: 'SBY-001', isMaster: false, address: 'Surabaya Timur', phone: '031-987654', email: 'sby@malesgerak.com' },
];

const BranchManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout pageTitle="Manajemen Cabang">
      <div className="p-4 md:p-6 lg:p-10 h-full overflow-y-auto bg-slate-50">
        <div className="mb-6 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase font-cyber italic">
                MANAJEMEN CABANG
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                Kelola Unit Kerja & Kantor Cabang Perusahaan
              </p>
            </div>
            <Button variant="primary" size="sm">
              <Plus size={16} />
              <span>Tambah Cabang</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              placeholder="Cari cabang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBranches.map((branch) => (
            <Card key={branch.id} className={`hover:shadow-xl transition-all border-l-4 ${branch.isMaster ? 'border-l-emerald-500' : 'border-l-blue-500'}`} padding={true}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Building2 size={20} />
                </div>
                {branch.isMaster && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">
                    MASTER BRANCH
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-slate-800 mb-1">{branch.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{branch.code}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <MapPin size={12} className="text-slate-400" />
                  {branch.address}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <Phone size={12} className="text-slate-400" />
                  {branch.phone}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <Mail size={12} className="text-slate-400" />
                  {branch.email}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="flex-1 text-[10px]">
                  <Edit2 size={12} /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-[10px] text-red-400 hover:text-red-500 hover:bg-red-500/5">
                  <Trash2 size={12} /> Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BranchManagement;
