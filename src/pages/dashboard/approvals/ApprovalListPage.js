import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, FileText, AlertCircle, Loader2, Download, Eye, Clock, User, Building, BookOpen } from "lucide-react";
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
import approvalService from "@/services/approvalService";
import repositoryService from "@/services/repositoryService";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ApprovalListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail Modal State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchPendingRepos();
  }, []);

  const fetchPendingRepos = async () => {
    try {
      setLoading(true);
      const res = await approvalService.getPendingRepos();
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching pending repos:", error);
      toast.error("Gagal memuat daftar dokumen pending.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
      const search = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(search) || 
        item.author?.toLowerCase().includes(search)
      );
  });

  const openDialog = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    setRejectReason("");
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (actionType === "reject" && !rejectReason.trim()) {
      toast.error("Alasan penolakan / Note revisi wajib diisi!");
      return;
    }

    try {
      setIsSubmitting(true);
      if (actionType === "approve") {
        await approvalService.approveRepo(selectedItem.id);
        toast.success("Dokumen berhasil disetujui dan dipublish!");
      } else {
        await approvalService.rejectRepo(selectedItem.id, rejectReason);
        toast.success("Dokumen dikembalikan untuk direvisi.");
      }
      
      setIsDialogOpen(false);
      // Refresh list
      fetchPendingRepos();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat memproses dokumen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = async (item) => {
    setDetailItem(null);
    setIsDetailOpen(true);
    try {
      setDetailLoading(true);
      const res = await repositoryService.getRepositoryById(item.id);
      setDetailItem(res);
    } catch(err) {
      console.error(err);
      toast.error("Gagal memuat detail spesifik dokumen.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownload = async (item) => {
    try {
      setIsDownloading(true);
      const blob = await repositoryService.downloadRepositoryBlob(item.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.file_name || `${item.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
       toast.error(error.response?.data?.message || "Gagal mengunduh dokumen");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Pending Approvals
          </h2>
          <p className="text-slate-500">Review dan setujui karya ilmiah mahasiswa yang baru diajukan.</p>
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 mb-4 px-3 py-2 border border-slate-200 rounded-lg w-full max-w-md focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul atau nama penulis..."
            className="w-full text-sm outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4 mt-6">
          {loading ? (
             <div className="flex justify-center items-center p-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
               <div className="flex flex-col items-center gap-3">
                 <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                 <p className="text-sm font-medium text-slate-500">Memuat daftar antrean...</p>
               </div>
             </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col sm:flex-row gap-5"
              >
                {/* Status Badge (Absolute on Desktop, Normal on Mobile) */}
                <div className="absolute top-5 right-5 hidden sm:block">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Review
                  </span>
                </div>

                {/* Icon Column */}
                <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-xl bg-orange-50 items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-orange-100">
                  <FileText className="w-7 h-7" />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="sm:hidden mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Review
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-700 transition-colors line-clamp-2 md:pr-32">
                    {item.title}
                  </h3>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <User className="w-4 h-4 text-slate-400" />
                      {item.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-slate-400" />
                      {item.prodi?.name || 'Prodi Tidak Diketahui'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      {item.docType?.name || 'Dokumen'}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => handleViewDetail(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors border border-blue-200/50"
                    >
                      <Eye className="w-4 h-4" /> 
                      Lihat Detail
                    </button>
                    
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <button 
                        onClick={() => openDialog(item, "reject")}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-lg transition-colors border border-red-200/50"
                      >
                        <XCircle className="w-4 h-4" /> 
                        Tolak & Revisi
                      </button>
                      <button 
                        onClick={() => openDialog(item, "approve")}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> 
                        Setujui
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-20 h-20 mb-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-4 border-white shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Semua Selesai!</h3>
              <p className="text-base text-slate-500 max-w-sm">
                Tidak ada dokumen yang mengantre untuk di-review. Kerja bagus, Anda sudah memproses semuanya.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Approve/Reject Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Setujui Dokumen?" : "Tolak Dokumen (Perlu Revisi)?"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? `Anda akan menyetujui dokumen "${selectedItem?.title}". Dokumen akan berstatus Published dan dapat dilihat secara publik.`
                : `Dokumen "${selectedItem?.title}" akan dikembalikan ke penulis untuk direvisi.`}
            </DialogDescription>
          </DialogHeader>
          
          {actionType === "reject" && (
            <div className="py-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Note Revisi <span className="text-red-500">*</span></label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-y"
                rows={4}
                placeholder="Contoh: Bab 2 kutipan tidak sesuai format."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
            <Button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {actionType === "approve" ? "Ya, Setujui" : "Kirim Note Revisi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Document Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl">Detail Karya Ilmiah</DialogTitle>
            <DialogDescription>
              Tinjau metadata dan abstrak dokumen sebelum memberikan approval.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            {detailLoading ? (
               <div className="flex justify-center items-center h-48">
                 <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
               </div>
            ) : detailItem ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{detailItem.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {detailItem.docType?.name || 'Unknown Type'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {detailItem.prodi?.name || 'Unknown Prodi'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      {detailItem.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-lg text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Penulis Utama</p>
                    <p className="font-medium text-slate-800">{detailItem.author}</p>
                    {detailItem.npm_nidn && <p className="text-slate-500 text-xs mt-0.5">{detailItem.npm_nidn}</p>}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Tahun Terbit</p>
                    <p className="font-medium text-slate-800">{detailItem.year || '-'}</p>
                  </div>
                  {(detailItem.pembimbing1 || detailItem.pembimbing2) && (
                    <div className="md:col-span-2">
                      <p className="text-slate-500 text-xs">Dosen Pembimbing</p>
                      <ul className="list-disc list-inside font-medium text-slate-700">
                        {detailItem.pembimbing1 && <li>{detailItem.pembimbing1}</li>}
                        {detailItem.pembimbing2 && <li>{detailItem.pembimbing2}</li>}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Abstrak</h4>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed max-w-none whitespace-pre-wrap">
                    {detailItem.abstract || <span className="text-slate-400 italic">Tidak ada abstrak yang dilampirkan.</span>}
                  </div>
                </div>

                <div className="p-4 border border-orange-100 bg-orange-50/50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> File Dokumen Lampiran
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 truncate mr-4">
                      {detailItem.file_name} ({(detailItem.file_size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(detailItem)}
                      disabled={isDownloading}
                      className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    >
                      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Unduh Berkas
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
               <div className="text-center text-slate-500 py-12">Detail tidak ditemukan.</div>
            )}
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-slate-50 shrink-0 flex-col sm:flex-row gap-2 justify-between items-center sm:items-stretch">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  setIsDetailOpen(false);
                  openDialog(detailItem, "reject");
                }}
                disabled={detailLoading || !detailItem}
              >
                <XCircle className="w-4 h-4 mr-2" /> Tolak & Kembalikan
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                onClick={() => {
                  setIsDetailOpen(false);
                  openDialog(detailItem, "approve");
                }}
                disabled={detailLoading || !detailItem}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Setujui Dokumen
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
