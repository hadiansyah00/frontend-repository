import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import masterDataService from "@/services/masterDataService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProgramStudiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", head: "", status: "Aktif" });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await masterDataService.getProdis();
      setData(res);
    } catch (error) {
      toast.error("Gagal mengambil data Program Studi");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = async (item) => {
    try {
      const newStatus = item.status === "Aktif" ? "Tidak Aktif" : "Aktif";
      await masterDataService.updateProdi(item.id, { status: newStatus });
      setData(data.map(d => d.id === item.id ? { ...d, status: newStatus } : d));
      toast.success(`Status ${item.name} berhasil diubah`);
    } catch (error) {
      toast.error("Gagal mengubah status");
    }
  };

  // --- CRUD Handlers ---
  const openCreate = () => {
    setEditingItem(null);
    setForm({ code: "", name: "", head: "", status: "Aktif" });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ code: item.code, name: item.name, head: item.head || "", status: item.status });
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
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Kode dan Nama Prodi wajib diisi!");
      return;
    }

    setSubmitLoading(true);
    try {
      if (editingItem) {
        await masterDataService.updateProdi(editingItem.id, form);
        toast.success(`Program Studi "${form.name}" berhasil diperbarui.`);
      } else {
        await masterDataService.createProdi(form);
        toast.success(`Program Studi "${form.name}" berhasil ditambahkan.`);
      }
      setIsFormOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    setSubmitLoading(true);
    try {
      await masterDataService.deleteProdi(deletingItem.id);
      toast.success(`Program Studi "${deletingItem.name}" berhasil dihapus.`);
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus prodi");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Program Studi
          </h2>
          <p className="text-slate-500">Kelola master data program studi dan fakultas.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4" />
          Tambah Prodi Baru
        </Button>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 mb-4 px-3 py-2 border border-slate-200 rounded-lg w-full max-w-md focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
           <Search className="w-5 h-5 text-slate-400" />
           <input
             type="text"
             placeholder="Cari nama atau kode prodi..."
             className="w-full text-sm bg-transparent outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-6 py-3">ID / Kode</th>
                <th className="px-6 py-3">Nama Program Studi</th>
                <th className="px-6 py-3">Kepala Prodi</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                     <td className="px-6 py-4 font-mono text-slate-500">{item.code}</td>
                     <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                     <td className="px-6 py-4 text-slate-600">{item.head}</td>
                     <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleStatus(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                            item.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {item.status === 'Aktif' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />}
                          {item.status}
                        </button>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDelete(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                            <Trash className="w-4 h-4" />
                          </button>
                       </div>
                     </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Program Studi" : "Tambah Program Studi Baru"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Perbarui informasi program studi di bawah ini." : "Isi data program studi baru yang akan ditambahkan ke sistem."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kode Prodi <span className="text-red-500">*</span></label>
              <input name="code" value={form.code} onChange={handleFormChange} placeholder="Contoh: S1-F" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program Studi <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Contoh: S1 Farmasi" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kepala Prodi</label>
              <input name="head" value={form.head} onChange={handleFormChange} placeholder="Nama Ketua/Kepala Prodi" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">{editingItem ? "Simpan Perubahan" : "Tambah Prodi"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Program Studi?</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus <strong>"{deletingItem?.name}"</strong> ({deletingItem?.code})? Tindakan ini tidak dapat dibatalkan.
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
