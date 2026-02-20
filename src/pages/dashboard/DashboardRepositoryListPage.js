import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import repositoryService from "@/services/repositoryService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardRepositoryListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("");
  const [docTypes, setDocTypes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await repositoryService.getRepositories({
        page,
        limit: 10,
        search: searchTerm,
        doc_type_id: docTypeFilter || undefined
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (error) {
      toast.error("Gagal mengambil data repositori");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, docTypeFilter]);

  const fetchDocTypes = async () => {
    try {
      // Import masterDataService dynamically or if it's already there (need to add import)
      const res = await (await import("@/services/masterDataService")).default.getDocTypes();
      setDocTypes(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error("Failed fetching doc types:", error);
    }
  };

  useEffect(() => {
    fetchDocTypes();
  }, []);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSearchParams({ page: 1 }); // reset to page 1 on search
  };

  const handleDocTypeChange = (e) => {
    setDocTypeFilter(e.target.value);
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  const openDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await repositoryService.deleteRepository(deletingItem.id);
      toast.success(`Repositori "${deletingItem.title}" berhasil dihapus.`);
      setIsDeleteOpen(false);
      fetchRepositories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus repositori");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Repositories
          </h2>
          <p className="text-slate-500">Kelola semua data karya ilmiah.</p>
        </div>
        <Link to="/dashboard/repositories/new">
          <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
            <Plus className="w-4 h-4" />
            Tambah Repositori
          </Button>
        </Link>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg w-full max-w-md focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul atau penulis..."
              className="w-full text-sm outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
             className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-orange-200 w-full sm:w-[250px]"
             value={docTypeFilter}
             onChange={handleDocTypeChange}
          >
             <option value="">Semua Jenis Dokumen</option>
             {docTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
             ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-6 py-3">Judul</th>
                <th className="px-6 py-3">Penulis</th>
                <th className="px-6 py-3">Jenis Dokumen</th>
                <th className="px-6 py-3 text-center">Tahun</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    Memuat data repositori...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((repo) => (
                  <tr key={repo.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate">
                      {repo.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{repo.author}</td>
                    <td className="px-6 py-4 text-slate-600">{repo.docType?.name || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{repo.year}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        repo.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                        repo.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                        repo.status === 'pending review' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {repo.status.charAt(0).toUpperCase() + repo.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/repositories/${repo.id}/edit`}>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button onClick={() => openDelete(repo)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada repositori ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Real Pagination */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            Menampilkan {data.length} dari total {pagination.totalItems} data
          </span>
          <div className="flex gap-1">
            <Button 
               variant="outline" 
               size="sm" 
               disabled={pagination.currentPage === 1}
               onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Prev
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-100">
              Halaman {pagination.currentPage} / {pagination.totalPages || 1}
            </Button>
            <Button 
               variant="outline" 
               size="sm" 
               disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
               onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Repositori?</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus <strong>"{deletingItem?.title}"</strong> oleh {deletingItem?.author}? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
