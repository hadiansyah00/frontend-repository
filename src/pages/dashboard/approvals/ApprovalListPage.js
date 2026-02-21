import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, FileText, AlertCircle, Loader2 } from "lucide-react";
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

export default function ApprovalListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center p-12">
               <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
             </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-6 py-3">Dokumen</th>
                  <th className="px-6 py-3">Penyusun / Prodi</th>
                  <th className="px-6 py-3">Tanggal Submit</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 max-w-[300px] truncate">{item.title}</div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 cursor-pointer hover:underline cursor-pointer">
                          <FileText className="w-3.5 h-3.5" /> Lihat Detail Dokumen
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{item.author}</div>
                        <div className="text-xs text-slate-500">
                           {item.prodi?.name || 'Tidak ada Prodi'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.createdAt || item.created_at ? new Date(item.createdAt || item.created_at).toLocaleDateString("id-ID", {
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        }) : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openDialog(item, "reject")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                          <button 
                            onClick={() => openDialog(item, "approve")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <CheckCircle className="w-12 h-12 mb-3 text-emerald-200" />
                        <p className="text-base font-medium text-slate-700">Tidak ada dokumen yang perlu di-review!</p>
                        <p className="text-sm mt-1">Semua dokumen mahasiswa sudah Anda proses.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
    </div>
  );
}
