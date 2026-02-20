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

export default function DocTypePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", is_active: true });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await masterDataService.getDocTypes();
      setData(res);
    } catch (error) {
      toast.error("Gagal mengambil data Jenis Dokumen");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = async (item) => {
    try {
      const newStatus = !item.is_active;
      await masterDataService.updateDocType(item.id, { is_active: newStatus });
      setData(data.map(d => d.id === item.id ? { ...d, is_active: newStatus } : d));
      toast.success(`Status ${item.name} berhasil diubah`);
    } catch (error) {
      toast.error("Gagal mengubah status");
    }
  };

  // --- CRUD Handlers ---
  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: "", slug: "", description: "", is_active: true });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, slug: item.slug, description: item.description || "", is_active: item.is_active });
    setIsFormOpen(true);
  };

  const openDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && !editingItem) {
      // Auto-generate slug from name
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
      setForm({ ...form, name: value, slug: autoSlug });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Nama dan Slug jenis dokumen wajib diisi!");
      return;
    }

    setSubmitLoading(true);
    try {
      if (editingItem) {
        await masterDataService.updateDocType(editingItem.id, form);
        toast.success(`Jenis Dokumen "${form.name}" berhasil diperbarui.`);
      } else {
        await masterDataService.createDocType(form);
        toast.success(`Jenis Dokumen "${form.name}" berhasil ditambahkan.`);
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
      await masterDataService.deleteDocType(deletingItem.id);
      toast.success(`Jenis Dokumen "${deletingItem.name}" berhasil dihapus.`);
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus dokumen");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Jenis Dokumen
          </h2>
          <p className="text-slate-500">Kelola kategori dan tipe karya ilmiah sistem.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4" />
          Tambah Jenis Dokumen
        </Button>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 mb-4 px-3 py-2 border border-slate-200 rounded-lg w-full max-w-md focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
           <Search className="w-5 h-5 text-slate-400" />
           <input
             type="text"
             placeholder="Cari jenis dokumen..."
             className="w-full text-sm bg-transparent outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-6 py-3">Nama Jenis Dokumen</th>
                <th className="px-6 py-3 pr-20">Deskripsi</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
               {loading ? (
                 <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                      Memuat data...
                    </td>
                 </tr>
               ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                         {item.name}
                         <div className="text-xs font-mono font-normal text-slate-400 mt-0.5">slug: {item.slug}</div>
                       </td>
                       <td className="px-6 py-4 text-slate-600">{item.description}</td>
                       <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleStatus(item)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                              item.is_active
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {item.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />}
                            {item.is_active ? 'Aktif' : 'Tidak Aktif'}
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
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
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
            <DialogTitle>{editingItem ? "Edit Jenis Dokumen" : "Tambah Jenis Dokumen Baru"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Perbarui informasi jenis dokumen." : "Isi data kategori dokumen baru untuk sistem."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Jenis Dokumen <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Contoh: Skripsi" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug <span className="text-red-500">*</span></label>
              <input name="slug" value={form.slug} onChange={handleFormChange} placeholder="auto-generated dari nama" className="w-full px-3 py-2 text-sm font-mono border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="Deskripsi singkat tentang jenis dokumen ini" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-y" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={submitLoading}>Batal</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={submitLoading}>
              {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingItem ? "Simpan Perubahan" : "Tambah Dokumen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Jenis Dokumen?</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus <strong>"{deletingItem?.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitLoading}>Batal</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={submitLoading}>
              {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
