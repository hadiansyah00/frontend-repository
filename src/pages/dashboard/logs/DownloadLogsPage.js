import { useState } from "react";
import { Download, Search, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_DOWNLOAD_LOGS = [
  { id: 1, user: "Ani Mahasiswa", role: "Mahasiswa", prodi: "D3 Kebidanan", document: "Efektivitas Edukasi Gizi terhadap Pengetahuan Ibu", docId: 101, timestamp: "2024-03-15 14:30:21", ip: "192.168.1.10" },
  { id: 2, user: "Budi Super", role: "Super Admin", prodi: "All", document: "Asuhan Kebidanan Komprehensif Pada Ny. S", docId: 102, timestamp: "2024-03-15 10:15:05", ip: "10.0.0.5" },
  { id: 3, user: "Guest User", role: "Guest", prodi: "-", document: "Sistem Informasi Geografis Puskesmas", docId: 3, timestamp: "2024-03-14 20:45:11", ip: "140.21.43.11" },
  { id: 4, user: "Siti Admin Farmasi", role: "Admin Prodi", prodi: "Farmasi", document: "Uji Fitokimia Ekstrak Daun Kelor", docId: 103, timestamp: "2024-03-14 09:12:33", ip: "192.168.1.55" },
  { id: 5, user: "Dimas Mhs", role: "Mahasiswa", prodi: "S1 Farmasi", document: "Pengaruh Pola Makan Terhadap Kesehatan", docId: 1, timestamp: "2024-03-13 16:50:00", ip: "114.120.33.2" },
];

export default function DownloadLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = MOCK_DOWNLOAD_LOGS.filter(log => 
    log.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Download Logs
          </h2>
          <p className="text-slate-500">Catatan riwayat unduhan dokumen untuk mencegah penyalahgunaan.</p>
        </div>
        <Button variant="outline" className="gap-2 bg-white">
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 mb-4 px-3 py-2 border border-slate-200 rounded-lg w-full max-w-md focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama user atau judul dokumen..."
            className="w-full text-sm outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-y border-slate-200">
              <tr>
                 <th className="px-6 py-3">Waktu (Timestamps)</th>
                 <th className="px-6 py-3">Pengguna</th>
                 <th className="px-6 py-3 min-w-[300px]">Dokumen yang Diunduh</th>
                 <th className="px-6 py-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                       {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full shrink-0 ${log.role === 'Guest' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                             <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{log.user}</div>
                            <div className="text-xs text-slate-500">{log.role} {log.prodi !== '-' ? `• ${log.prodi}` : ''}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <span className="font-medium text-slate-700 hover:text-orange-600 cursor-pointer">{log.document}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                       {log.ip}
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
        </div>
      </div>
    </div>
  );
}
