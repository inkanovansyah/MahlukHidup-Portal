import { useState } from 'react';
import {
  Users, Plus, Edit2, Trash2, X, Check, Search,
  AlertCircle, Mail, Shield, UserCheck, UserX, Key
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

const mockUsers: UserDto[] = [
  {
    id: 983, name: 'Inka Novansyah', email: 'inka@malesgerak.com',
    role: 'Manager', isActive: true, lastLogin: '2026-04-12 09:30',
    createdAt: '2025-01-15'
  },
  {
    id: 984, name: 'Budi Santoso', email: 'budi@malesgerak.com',
    role: 'Agronom', isActive: true, lastLogin: '2026-04-11 14:20',
    createdAt: '2025-02-20'
  },
  {
    id: 985, name: 'Siti Rahayu', email: 'siti@malesgerak.com',
    role: 'Operator', isActive: true, lastLogin: '2026-04-10 08:15',
    createdAt: '2025-03-10'
  },
  {
    id: 986, name: 'Ahmad Fauzi', email: 'ahmad@malesgerak.com',
    role: 'Technician', isActive: false, lastLogin: '2026-03-28 16:45',
    createdAt: '2025-04-05'
  },
  {
    id: 987, name: 'Dewi Lestari', email: 'dewi@malesgerak.com',
    role: 'Agronom', isActive: true, lastLogin: '2026-04-12 07:00',
    createdAt: '2025-05-12'
  },
];

const availableRoles = ['Manager', 'Agronom', 'Operator', 'Technician'];

const UserManagement = () => {
  const [users, setUsers] = useState<UserDto[]>(mockUsers);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Operator', password: '' });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: UserDto) => {
    if (user) {
      setEditingUser(user);
      setForm({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setEditingUser(null);
      setForm({ name: '', email: '', role: 'Operator', password: '' });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
    } else {
      const newUser: UserDto = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...form,
        isActive: true,
        lastLogin: 'Belum pernah',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  const handleToggleActive = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleDelete = (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    setUsers(users.filter(u => u.id !== id));
  };

  const roleColors: Record<string, string> = {
    Manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Agronom: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Operator: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    Technician: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <DashboardLayout pageTitle="Manajemen User">
    <div className="p-4 md:p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase font-cyber italic">
              MANAJEMEN USER
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Kelola Akses & Peran Pengguna Sistem
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => handleOpenModal()} className="md:text-sm">
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah User</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-emerald-500/30 transition-all" padding={true}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg"><Users size={18} /></div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total User</p>
              <p className="text-xl font-black text-slate-800">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="hover:border-sky-500/30 transition-all" padding={true}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-lg"><UserCheck size={18} /></div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Aktif</p>
              <p className="text-xl font-black text-slate-800">{users.filter(u => u.isActive).length}</p>
            </div>
          </div>
        </Card>
        <Card className="hover:border-rose-500/30 transition-all" padding={true}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-lg"><UserX size={18} /></div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Nonaktif</p>
              <p className="text-xl font-black text-slate-800">{users.filter(u => !u.isActive).length}</p>
            </div>
          </div>
        </Card>
        <Card className="hover:border-purple-500/30 transition-all" padding={true}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-lg"><Shield size={18} /></div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Manager</p>
              <p className="text-xl font-black text-slate-800">{users.filter(u => u.role === 'Manager').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            type="text"
            placeholder="Cari user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden" padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-100">
                  <th className="text-left py-3 px-4 font-black">User</th>
                  <th className="text-left py-3 px-4 font-black">Role</th>
                  <th className="text-center py-3 px-4 font-black">Status</th>
                  <th className="text-center py-3 px-4 font-black hidden md:table-cell">Login Terakhir</th>
                  <th className="text-center py-3 px-4 font-black hidden lg:table-cell">Dibuat</th>
                  <th className="text-center py-3 px-4 font-black">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-500 font-bold">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={32} className="text-slate-500" />
                        <p>Tidak ada user ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-200 hover:bg-blue-900/10 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            user.isActive ? 'bg-gradient-to-br from-emerald-400 to-sky-500 text-slate-800' : 'bg-slate-600 text-slate-300'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-[9px] text-slate-500 flex items-center gap-1">
                              <Mail size={10} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${roleColors[user.role] || 'bg-slate-500/20 text-slate-500'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          user.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <span className="text-slate-300 font-bold">{user.lastLogin}</span>
                      </td>
                      <td className="py-3 px-4 text-center hidden lg:table-cell">
                        <span className="text-slate-500 font-bold">{user.createdAt}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-1.5 bg-slate-100 hover:bg-blue-700/50 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                            title="Edit"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.isActive ? 'bg-amber-800/30 hover:bg-amber-700/50 text-amber-400 hover:text-amber-300' : 'bg-emerald-800/30 hover:bg-emerald-700/50 text-emerald-400 hover:text-emerald-300'
                            }`}
                            title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {user.isActive ? <UserX size={11} /> : <UserCheck size={11} />}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 bg-red-800/30 hover:bg-red-700/50 rounded-lg transition-colors text-red-400 hover:text-red-300"
                            title="Hapus"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Key size={18} className="text-emerald-400" />
              {editingUser ? 'Edit User' : 'Tambah User Baru'}
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          <form onSubmit={handleSave} className="p-4 md:p-6 space-y-4">
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@domain.com"
                required
                disabled={!!editingUser}
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!editingUser && (
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" fullWidth onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                <Check size={16} />
                {editingUser ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
