import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Edit, Trash, Loader2, FileText, Clock, User, Building, BookOpen, AlertCircle, CheckCircle, Info } from "lucide-react";
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

        <div className="grid gap-4 mt-6">
          {loading ? (
             <div className="flex justify-center items-center p-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
               <div className="flex flex-col items-center gap-3">
                 <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                 <p className="text-sm font-medium text-slate-500">Memuat data repositori...</p>
               </div>
             </div>
          ) : data.length > 0 ? (
            data.map((repo) => (
              <div 
                key={repo.id} 
                className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col sm:flex-row gap-5"
              >
                {/* Status Badge (Absolute on Desktop, Normal on Mobile) */}
                <div className="absolute top-5 right-5 hidden sm:block">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                        repo.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                        repo.status === 'draft' ? 'bg-slate-50 text-slate-700 border-slate-200/50' :
                        repo.status === 'pending review' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                        repo.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200/50' :
                        'bg-amber-50 text-amber-700 border-amber-200/50'
                      }`}>
                    {repo.status === 'published' ? <CheckCircle className="w-3.5 h-3.5" /> :
                     repo.status === 'rejected' ? <AlertCircle className="w-3.5 h-3.5" /> :
                     <Clock className="w-3.5 h-3.5" />}
                    {repo.status.charAt(0).toUpperCase() + repo.status.slice(1)}
                  </span>
                </div>

                {/* Icon Column */}
                <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-xl bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-orange-100">
                  <FileText className="w-7 h-7" />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="sm:hidden mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                        repo.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                        repo.status === 'draft' ? 'bg-slate-50 text-slate-700 border-slate-200/50' :
                        repo.status === 'pending review' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                        repo.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200/50' :
                        'bg-amber-50 text-amber-700 border-amber-200/50'
                      }`}>
                      {repo.status === 'published' ? <CheckCircle className="w-3.5 h-3.5" /> :
                       repo.status === 'rejected' ? <AlertCircle className="w-3.5 h-3.5" /> :
                       <Clock className="w-3.5 h-3.5" />}
                      {repo.status.charAt(0).toUpperCase() + repo.status.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-700 transition-colors line-clamp-2 md:pr-40">
                    {repo.title}
                  </h3>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <User className="w-4 h-4 text-slate-400" />
                      {repo.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-slate-400" />
                      {repo.docType?.name || 'Dokumen'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {repo.year || '-'}
                    </div>
                  </div>

                  {repo.status === 'rejected' && repo.reject_note && (
                    <div className="mt-4 p-3 bg-red-50/80 border border-red-100 rounded-lg flex gap-3 text-red-800 text-sm">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <span className="font-semibold block mb-0.5">Catatan Revisi:</span>
                        {repo.reject_note}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
                    <Link to={`/dashboard/repositories/${repo.id}/edit`}>
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-700 rounded-lg transition-colors border border-slate-200 shadow-sm" title="Edit">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    </Link>
                    <button 
                      onClick={() => openDelete(repo)} 
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-lg transition-colors border border-slate-200 shadow-sm" 
                      title="Hapus"
                    >
                      <Trash className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Tidak ada repositori</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Belum ada data repositori yang ditemukan atau sesuai dengan pencarian Anda.
              </p>
            </div>
          )}
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
