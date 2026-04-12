import { useState, useEffect } from 'react';
import {
  Building2, MapPin, Plus, Edit2, Trash2, X, Check,
  ChevronDown, ChevronRight, Search, AlertCircle, Building
} from 'lucide-react';
import { companyApi, branchApi } from '../api/company.api';
import type { CompanyDto, BranchDto, CompanyCreateDto, BranchCreateDto } from '../types/company.types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyDto | null>(null);
  const [editingBranch, setEditingBranch] = useState<BranchDto | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Form states
  const [companyForm, setCompanyForm] = useState<CompanyCreateDto>({
    name: '',
    code: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  const [branchForm, setBranchForm] = useState<BranchCreateDto>({
    companyId: '',
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    latitude: undefined,
    longitude: undefined
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyApi.getAllCompanies();
      setCompanies(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCompanyModal = (company?: CompanyDto) => {
    if (company) {
      setEditingCompany(company);
      setCompanyForm({
        name: company.name,
        code: company.code,
        description: company.description || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || ''
      });
    } else {
      setEditingCompany(null);
      setCompanyForm({
        name: '',
        code: '',
        description: '',
        address: '',
        phone: '',
        email: ''
      });
    }
    setShowCompanyModal(true);
  };

  const handleOpenBranchModal = (companyId: string, branch?: BranchDto) => {
    setSelectedCompanyId(companyId);
    if (branch) {
      setEditingBranch(branch);
      setBranchForm({
        companyId,
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
        companyId,
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

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await companyApi.updateCompany(editingCompany.id, companyForm);
      } else {
        await companyApi.createCompany(companyForm);
      }
      setShowCompanyModal(false);
      fetchCompanies();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to save company');
    }
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
      fetchCompanies();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to save branch');
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this company and all its branches?')) return;
    try {
      await companyApi.deleteCompany(id);
      fetchCompanies();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to delete company');
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this branch?')) return;
    try {
      await branchApi.deleteBranch(id);
      fetchCompanies();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to delete branch');
    }
  };

  const toggleExpand = (companyId: string) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar bg-[#0b1730]">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase font-cyber italic">
              MANAJEMEN PERUSAHAAN
            </h2>
            <p className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mt-1">
              Kelola Perusahaan dan Cabang
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenCompanyModal()}
            className="md:text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah Perusahaan</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Cari perusahaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl pl-12 pr-4 py-6 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/30 border-t-emerald-500" />
        </div>
      ) : (
        /* Companies List */
        <div className="space-y-4">
          {filteredCompanies.length === 0 ? (
            <Card className="text-center py-16">
              <Building2 size={48} className="mx-auto text-slate-500 mb-4" />
              <p className="text-lg font-bold text-slate-400">Tidak ada perusahaan</p>
              <p className="text-sm text-slate-500 mt-2">Klik "Tambah Perusahaan" untuk memulai</p>
            </Card>
          ) : (
            filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:border-emerald-500/30 transition-all" padding={false}>
                {/* Company Header */}
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                          <h3 className="text-base md:text-lg font-black text-white uppercase font-cyber italic truncate">
                            {company.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            company.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {company.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        <p className="text-xs text-blue-400/70 font-bold mt-0.5">Kode: {company.code}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                          {company.email && (
                            <span className="truncate">{company.email}</span>
                          )}
                          {company.phone && (
                            <span>| {company.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenCompanyModal(company)}
                        className="p-2 bg-blue-800/30 hover:bg-blue-700/50 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="p-2 bg-red-800/30 hover:bg-red-700/50 rounded-lg transition-colors text-red-400 hover:text-red-300"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => toggleExpand(company.id)}
                        className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
                        title="Lihat Cabang"
                      >
                        {expandedCompany === company.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Branches Section */}
                  {expandedCompany === company.id && (
                    <div className="mt-6 pt-6 border-t border-blue-800/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <MapPin size={14} className="text-emerald-400" />
                          Daftar Cabang ({company.branches?.length || 0})
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenBranchModal(company.id)}
                          className="text-xs"
                        >
                          <Plus size={12} />
                          Tambah Cabang
                        </Button>
                      </div>

                      {company.branches && company.branches.length > 0 ? (
                        <div className="space-y-3">
                          {company.branches.map((branch: BranchDto) => (
                            <BranchCard
                              key={branch.id}
                              branch={branch}
                              onEdit={() => handleOpenBranchModal(company.id, branch)}
                              onDelete={() => handleDeleteBranch(branch.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-800/30 rounded-xl">
                          <MapPin size={32} className="mx-auto text-slate-500 mb-2" />
                          <p className="text-sm text-slate-400 font-bold">Belum ada cabang</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Company Modal */}
      <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
        <DialogContent className="max-w-2xl bg-[#0d1f47] border border-blue-800/40 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-black text-white uppercase font-cyber italic">
              {editingCompany ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCompany} className="space-y-4">
            <FormField label="Nama Perusahaan" required>
              <Input
                type="text"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                required
              />
            </FormField>

            <FormField label="Kode" required>
              <Input
                type="text"
                value={companyForm.code}
                onChange={(e) => setCompanyForm({ ...companyForm, code: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                required
                disabled={!!editingCompany}
              />
            </FormField>

            <FormField label="Alamat">
              <textarea
                value={companyForm.address || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                rows={2}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email">
                <Input
                  type="email"
                  value={companyForm.email || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                />
              </FormField>

              <FormField label="Telepon">
                <Input
                  type="text"
                  value={companyForm.phone || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-auto"
                />
              </FormField>
            </div>

            <FormField label="Deskripsi">
              <textarea
                value={companyForm.description || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                rows={2}
              />
            </FormField>

            <DialogFooter className="flex gap-3 pt-4 sm:flex-row">
              <Button type="button" variant="ghost" fullWidth onClick={() => setShowCompanyModal(false)}>
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

      {/* Branch Modal */}
      {showBranchModal && selectedCompanyId && (
        <Modal
          title={editingBranch ? 'Edit Cabang' : 'Tambah Cabang'}
          onClose={() => setShowBranchModal(false)}
        >
          <form onSubmit={handleSaveBranch} className="space-y-4">
            <FormField label="Nama Cabang" required>
              <input
                type="text"
                value={branchForm.name}
                onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </FormField>

            <FormField label="Kode" required>
              <input
                type="text"
                value={branchForm.code}
                onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
                disabled={!!editingBranch}
              />
            </FormField>

            <FormField label="Alamat">
              <textarea
                value={branchForm.address || ''}
                onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                rows={2}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email">
                <input
                  type="email"
                  value={branchForm.email || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </FormField>

              <FormField label="Telepon">
                <input
                  type="text"
                  value={branchForm.phone || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                  className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Latitude">
                <input
                  type="number"
                  step="any"
                  value={branchForm.latitude || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </FormField>

              <FormField label="Longitude">
                <input
                  type="number"
                  step="any"
                  value={branchForm.longitude || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </FormField>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" fullWidth onClick={() => setShowBranchModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                <Check size={16} />
                Simpan
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Branch Card Component
const BranchCard = ({ branch, onEdit, onDelete }: { branch: BranchDto; onEdit: () => void; onDelete: () => void }) => {
  return (
    <div className={`p-4 bg-slate-800/30 rounded-xl border ${branch.isActive ? 'border-blue-800/30' : 'border-red-800/30 opacity-60'} transition-all hover:border-emerald-500/20`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-sky-500/20 text-sky-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h5 className="text-sm font-bold text-white truncate">{branch.name}</h5>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                branch.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {branch.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <p className="text-xs text-blue-400/70 font-bold mt-0.5">Kode: {branch.code}</p>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-400">
              {branch.address && (
                <span className="truncate">{branch.address}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 bg-blue-800/30 hover:bg-blue-700/50 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
            title="Edit"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-red-800/30 hover:bg-red-700/50 rounded-lg transition-colors text-red-400 hover:text-red-300"
            title="Hapus"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d1f47] border border-blue-800/40 rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-[#0d1f47] border-b border-blue-800/30 p-4 md:p-6 flex items-center justify-between z-10">
          <h3 className="text-lg md:text-xl font-black text-white uppercase font-cyber italic">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Form Field Component
const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
};

export default CompanyManagement;
