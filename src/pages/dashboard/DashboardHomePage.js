import { useState, useEffect } from "react";
import { BookMarked, Users, Eye, ArrowUpRight, Clock, FileCheck, Loader2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import dashboardService from "@/services/dashboardService";
import { toast } from "sonner";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: null, barData: [], lineData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStats();
        if (res.success) {
          setData({
            stats: res.stats,
            barData: res.barData,
            lineData: res.lineData,
          });
        }
      } catch (error) {
        toast.error("Gagal mengambil data statistik dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading || !data.stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { stats, barData, lineData } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Selamat Datang, {user?.name?.split(" ")[0]}!
        </h2>
        <p className="text-slate-500">
          Ringkasan aktivitas repository dan pengguna terkini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Published</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-800">{stats.totalPublished}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <BookMarked className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>Update Realtime</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-orange-200 shadow-sm shadow-orange-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Menunggu Persetujuan</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-800">{stats.pendingReview}</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
               <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-slate-500">
            <span>Perlu ditinjau segera</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Pengguna</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-800">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
               <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>Pendaftar aktif</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Unduhan</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-800">{stats.totalDownloads}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
               <FileCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>Riwayat tercatat</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-6 bg-white border border-slate-200 rounded-xl lg:col-span-2">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Statistik Kunjungan & Unduhan (6 Bulan)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Views" />
                <Line type="monotone" dataKey="downloads" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Downloads" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Dokumen per Prodi
          </h3>
          <div className="h-[300px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                   <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="total" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} name="Total Dokumen" />
                 </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full text-slate-400 text-sm">Belum ada data dokumen prodi</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
