import { useState, useEffect } from "react";
import { Download, Search, FileText, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import downloadLogService from "@/services/downloadLogService";

const ITEMS_PER_PAGE = 10;

export default function DownloadLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await downloadLogService.getLogs({ 
        search: searchTerm,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      setLogs(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.totalItems);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Gagal memuat catatan unduhan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Download Logs
          </h2>
          <p className="text-slate-500">Catatan riwayat unduhan dokumen untuk mencegah penyalahgunaan.</p>
        </div>
        <Button variant="outline" className="gap-2 bg-white" onClick={() => toast.info("Fitur export ke CSV masih dalam pengembangan.")}>
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg w-full max-w-md focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama user atau judul dokumen..."
              className="w-full text-sm outline-none bg-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Total Logs: <span className="font-semibold text-slate-700">{totalItems}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center p-12">
               <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
             </div>
          ) : (
            <>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
                  <tr>
                     <th className="px-6 py-3">Waktu (Timestamps)</th>
                     <th className="px-6 py-3">Pengguna</th>
                     <th className="px-6 py-3 min-w-[300px]">Dokumen yang Diunduh</th>
                     <th className="px-6 py-3 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                           {log.createdAt || log.download_date ? new Date(log.createdAt || log.download_date).toLocaleString("id-ID", {
                             year: "numeric", month: "long", day: "numeric",
                             hour: '2-digit', minute: '2-digit', second: '2-digit'
                           }) : "-"}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full shrink-0 bg-blue-50 text-blue-600">
                                 <User className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{log.user?.name || "Unknown User"}</div>
                                <div className="text-xs text-slate-500">{log.user?.email || "No Email"}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                            <span className="font-medium text-slate-700 hover:text-orange-600 cursor-pointer">
                              {log.repository?.title || "Unknown Repository"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                           {log.ip_address || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                        Tidak ada catatan unduhan ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center border-t pt-6" data-testid="pagination">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
