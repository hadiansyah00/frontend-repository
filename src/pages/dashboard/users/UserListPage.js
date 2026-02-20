import { useState } from "react";
import { Search, Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MASTER_DATA } from "@/data/masterData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INITIAL_USERS = [
  { id: "1", name: "Budi Super", email: "super@example.com", nip: "10001", role: "Super Admin", prodi: "All", status: "Active" },
  { id: "2", name: "Siti Admin Farmasi", email: "admin.farmasi@example.com", nip: "10002", role: "Admin Prodi", prodi: "Farmasi", status: "Active" },
  { id: "3", name: "Pak Dosen Gizi", email: "dosen.gizi@example.com", nip: "20001", role: "Dosen / Reviewer", prodi: "Gizi", status: "Active" },
  { id: "4", name: "Ani Mahasiswa", email: "ani.mhs@example.com", nip: "11223344", role: "Mahasiswa", prodi: "D3 Kebidanan", status: "Active" },
  { id: "5", name: "Joko Susilo", email: "joko.susilo@example.com", nip: "99887766", role: "Mahasiswa", prodi: "Farmasi", status: "Inactive" },
];

const ROLE_OPTIONS = ["Super Admin", "Admin Prodi", "Dosen / Reviewer", "Mahasiswa"];

export default function UserListPage() {
  const [data, setData] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", nip: "", role: "Mahasiswa", prodi: "", status: "Active" });

  const activeProdis = MASTER_DATA.programStudi.filter(p => p.status === "Aktif");

  const filteredUsers = data.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.nip.includes(searchTerm);
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- CRUD Handlers ---
  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: "", email: "", nip: "", role: "Mahasiswa", prodi: "", status: "Active" });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, email: item.email, nip: item.nip, role: item.role, prodi: item.prodi, status: item.status });
    setIsFormOpen(true);
  };

  const openDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nama dan Email wajib diisi!");
      return;
    }

    if (editingItem) {
      setData(data.map(item =>
        item.id === editingItem.id ? { ...item, ...form } : item
      ));
      toast.success(`Pengguna "${form.name}" berhasil diperbarui.`);
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...form,
      };
      setData([...data, newItem]);
      toast.success(`Pengguna "${form.name}" berhasil ditambahkan.`);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    setData(data.filter(item => item.id !== deletingItem.id));
    toast.success(`Pengguna "${deletingItem.name}" berhasil dihapus.`);
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Manajemen Pengguna
          </h2>
          <p className="text-slate-500">Kelola akun admin, dosen, mahasiswa dan role mereka.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </Button>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row">
           <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg w-full md:w-[300px] focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
             <Search className="w-5 h-5 text-slate-400" />
             <input
               type="text"
               placeholder="Cari nama, email, NIP/NPM..."
               className="w-full text-sm bg-transparent outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>

           <select
             className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-orange-200 w-full sm:w-[200px]"
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
           >
             <option value="All">Semua Role</option>
             {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
           </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-6 py-3">Info Pengguna</th>
                <th className="px-6 py-3">Role Akses</th>
                <th className="px-6 py-3">Program Studi</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                     <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email} • {user.nip}</div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          user.role === 'Super Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          user.role === 'Admin Prodi' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          user.role === 'Dosen / Reviewer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {user.role}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-slate-600">{user.prodi}</td>
                     <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                          user.status === 'Active' ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {user.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit User">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDelete(user)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete User">
                            <Trash className="w-4 h-4" />
                          </button>
                       </div>
                     </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Perbarui informasi akun pengguna." : "Isi data akun baru yang akan didaftarkan ke sistem."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Nama lengkap" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIP / NPM</label>
                <input name="nip" value={form.nip} onChange={handleFormChange} placeholder="Nomor Induk" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="email@example.com" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select name="role" value={form.role} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
                <select name="prodi" value={form.prodi} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                  <option value="">-- Pilih Prodi --</option>
                  <option value="All">All (Super Admin)</option>
                  {activeProdis.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Akun</label>
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">{editingItem ? "Simpan Perubahan" : "Tambah Pengguna"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Pengguna?</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus akun <strong>"{deletingItem?.name}"</strong> ({deletingItem?.email})? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Ya, Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
