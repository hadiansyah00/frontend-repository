import { useState, useEffect } from "react";
import { Search, Edit, Plus, Trash, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import userService from "@/services/userService";
import masterDataService from "@/services/masterDataService";
import roleService from "@/services/roleService";

export default function UserListPage() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Master data for filters & forms
  const [activeProdis, setActiveProdis] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const initialFormState = { name: "", email: "", password: "", nip: "", role_id: "", prodi_id: "", status: "active" };
  const [form, setForm] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, prodisRes, rolesRes] = await Promise.all([
        userService.getUsers(),
        masterDataService.getProdis(),
        roleService.getRoles()
      ]);
      
      // userService returns { totalItems, users: [...] }
      setData(usersRes.users || usersRes.data || []);
      
      const prodisData = Array.isArray(prodisRes) ? prodisRes : prodisRes.data || [];
      setActiveProdis(prodisData.filter(p => p.status === "active" || p.status === "Aktif"));
      
      const rolesData = Array.isArray(rolesRes) ? rolesRes : rolesRes.data || [];
      setRoleOptions(rolesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mengambil data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = data.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.nip && user.nip.includes(searchTerm));
    const matchesRole = roleFilter === "All" || user.role?.name === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- CRUD Handlers ---
  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...initialFormState, role_id: roleOptions[0]?.id || "", prodi_id: "" });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ 
      name: item.name, 
      email: item.email, 
      password: "", // User must type new password to update it
      nip: item.nip || "", 
      role_id: item.role_id, 
      prodi_id: item.prodi_id || "", 
      status: item.status 
    });
    setIsFormOpen(true);
  };

  const openDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.role_id) {
      toast.error("Nama, Email, dan Role wajib diisi!");
      return;
    }

    if (!editingItem && !form.password) {
      toast.error("Password wajib diisi untuk pengguna baru!");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        nip: form.nip || null,
        role_id: form.role_id,
        prodi_id: form.prodi_id || null,
        status: form.status,
      };
      
      // Only send password if it's filled
      if (form.password) {
        payload.password = form.password;
      }

      if (editingItem) {
        await userService.updateUser(editingItem.id, payload);
        toast.success(`Pengguna "${form.name}" berhasil diperbarui.`);
      } else {
        await userService.createUser(payload);
        toast.success(`Pengguna "${form.name}" berhasil ditambahkan.`);
      }
      
      setIsFormOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan pengguna.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await userService.deleteUser(deletingItem.id);
      toast.success(`Pengguna "${deletingItem.name}" berhasil dihapus.`);
      setIsDeleteOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna.");
    } finally {
      setDeleteLoading(false);
    }
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
               placeholder="Cari nama, email, NIP..."
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
             {roleOptions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
           </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
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
                          <div className="text-xs text-slate-500">{user.email} {user.nip && `• ${user.nip}`}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role?.name === 'Super Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            user.role?.name?.includes('Admin') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            user.role?.name?.includes('Dosen') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {user.role?.name || "No Role"}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-slate-600">{user.prodi?.name || "-"}</td>
                       <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                            user.status === 'active' ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'
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
        )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                 <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="email@example.com" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">
                   Password {editingItem ? <span className="text-xs text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span> : <span className="text-red-500">*</span>}
                 </label>
                 <div className="relative">
                   <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleFormChange} placeholder="*****" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 pr-10" />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                   >
                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                   </button>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role <span className="text-red-500">*</span></label>
                <select name="role_id" value={form.role_id} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                  <option value="">-- Pilih Role --</option>
                  {roleOptions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
                <select name="prodi_id" value={form.prodi_id} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                  <option value="">-- Semua Prodi --</option>
                  {activeProdis.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Akun</label>
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={formLoading}>Batal</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={formLoading}>
               {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
               {editingItem ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
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
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={deleteLoading}>Batal</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deleteLoading}>
              {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

