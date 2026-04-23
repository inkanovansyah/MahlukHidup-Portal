import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Leaf, Clock, CheckCircle2, AlertCircle, Plus, Search } from 'lucide-react';

// Hardcoded Data simulate Dynamic Approval Levels
const mockRequests = [
  { 
    id: 'REQ-001', item: 'Pupuk Urea', quantity: '50 Zak', date: '12 Jun 2026', requester: 'Budi Santoso', role: 'Staff Operasional', status: 'pending', department: 'Pertanian', 
    currentStepIndex: 1, // Currently at Review Manager
    trackingSteps: ['Diajukan', 'Review Manager', 'Proses Beli', 'Pengiriman', 'Selesai']
  },
  { 
    id: 'REQ-002', item: 'Pestisida Pembasmi Gulma', quantity: '10 Liter', date: '10 Jun 2026', requester: 'Budi Santoso', role: 'Staff Operasional', status: 'approved', department: 'Pertanian', 
    currentStepIndex: 4, // Currently at Selesai
    trackingSteps: ['Diajukan', 'Review Manager', 'Proses Beli', 'Pengiriman', 'Selesai']
  },
  { 
    id: 'REQ-003', item: 'Bibit Jagung Hibrida', quantity: '2 Ton', date: '05 Jun 2026', requester: 'Andi Saputra', role: 'Agronomist', status: 'pending', department: 'Riset & Tanam', 
    currentStepIndex: 3, // Multi-level approval: Currently at Review CEO
    trackingSteps: ['Diajukan', 'Review Manager', 'Review GM', 'Review CEO', 'Proses Beli', 'Selesai']
  },
];

const SaprotanRequest = () => {
  return (
    <DashboardLayout pageTitle="Permintaan Saprotan">
      <div className="p-4 md:p-6 lg:p-8 overflow-y-auto w-full h-full custom-scrollbar bg-slate-50">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase font-cyber italic">Permintaan Saprotan</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pengajuan Kebutuhan Pupuk, Bibit & Obat</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus size={16} /> Buat Pengajuan Baru
          </Button>
        </div>

        {/* Filters/Search */}
        <Card className="mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Cari Pengajuan</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari ID, Nama Barang..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium" />
              </div>
            </div>
            <div className="w-full md:w-auto flex gap-2">
               <select className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600">
                 <option>Semua Status</option>
                 <option>Menunggu</option>
                 <option>Disetujui</option>
                 <option>Ditolak</option>
               </select>
            </div>
          </div>
        </Card>

        {/* Data List */}
        <div className="flex flex-col gap-4">
          {mockRequests.map((req) => (
            <Card key={req.id} padding={false} className="overflow-hidden hover:border-emerald-500/30 transition-colors">
              <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Info Utama */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    <Leaf size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-lg text-slate-800 uppercase italic tracking-tight">{req.item}</h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{req.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{req.quantity}</span>
                       <span>•</span>
                       <span>Tanggal: {req.date}</span>
                    </div>
                  </div>
                </div>

                {/* Pemohon & Status */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto bg-slate-50 p-3 md:p-0 rounded-xl md:bg-transparent">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pemohon</p>
                    <p className="text-sm font-black text-slate-700">{req.requester}</p>
                    <p className="text-[9px] text-sky-600 font-bold uppercase">{req.role} • {req.department}</p>
                  </div>
                  
                  <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                  
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {req.status === 'pending' && <Clock size={12} />}
                    {req.status === 'approved' && <CheckCircle2 size={12} />}
                    {req.status === 'rejected' && <AlertCircle size={12} />}
                    {req.status === 'pending' ? 'Menunggu Approval' : req.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </div>
                </div>
              </div>

              {/* Traking / Progress Bar Section */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 sm:px-6">
                <div className="relative">
                  {/* Line Background */}
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 z-0 hidden sm:block"></div>
                  
                  {/* Progress Line (Dynamic Width) */}
                  {req.status !== 'rejected' && (
                    <div 
                      className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -translate-y-1/2 z-0 hidden sm:block transition-all duration-500" 
                      style={{ width: `${(Math.max(req.currentStepIndex, 0) / (req.trackingSteps.length - 1)) * 100}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                    {req.trackingSteps.map((step, index) => {
                      const isCompleted = req.status === 'rejected' ? index === 0 : index < req.currentStepIndex;
                      const isCurrent = req.status === 'rejected' ? false : index === req.currentStepIndex;
                      const isRejected = req.status === 'rejected' && index === 1;

                      return (
                        <div key={index} className="flex sm:flex-col items-center gap-3 sm:gap-2 bg-slate-50 sm:bg-transparent px-2">
                          {/* Dot Indicator */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors duration-300 ${
                            isCompleted ? 'bg-emerald-500' : 
                            isRejected ? 'bg-red-500' :
                            isCurrent ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'
                          }`}>
                            {isCompleted && <CheckCircle2 size={10} className="text-white" />}
                            {isRejected && <AlertCircle size={10} className="text-white" />}
                          </div>
                          
                          {/* Label Step */}
                          <div className="text-left sm:text-center mt-0 sm:mt-1">
                            <p className={`text-[9px] font-black uppercase tracking-widest ${
                               isCompleted ? 'text-emerald-600' : 
                               isRejected ? 'text-red-600' :
                               isCurrent ? 'text-amber-600' : 'text-slate-400'
                            }`}>
                              {isRejected ? 'Ditolak' : step}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SaprotanRequest;
