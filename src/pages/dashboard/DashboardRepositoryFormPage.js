import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, Info, Loader2, FileText, Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import repositoryService from "@/services/repositoryService";
import masterDataService from "@/services/masterDataService";

export default function DashboardRepositoryFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeProdis, setActiveProdis] = useState([]);
  const [activeDocTypes, setActiveDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: user?.name || "",
    npm_nidn: user?.nip || "",
    doc_type_id: "",
    prodi_id: user?.prodi_id || "",
    pembimbing1: "",
    pembimbing2: "",
    year: new Date().getFullYear().toString(),
    status: "draft",
    access_level: "restricted",
    abstract: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Load master data for dropdowns
        const [prodis, docTypes] = await Promise.all([
          masterDataService.getProdis(),
          masterDataService.getDocTypes(),
        ]);
        setActiveProdis(prodis.filter((p) => p.status === "Aktif"));
        setActiveDocTypes(docTypes.filter((d) => d.is_active));

        if (isEdit) {
          const repo = await repositoryService.getRepositoryById(id);
          setForm({
            title: repo.title,
            author: repo.author,
            npm_nidn: repo.npm_nidn || "",
            doc_type_id: repo.doc_type_id || "",
            prodi_id: repo.prodi_id || "",
            pembimbing1: repo.pembimbing1 || "",
            pembimbing2: repo.pembimbing2 || "",
            year: repo.year.toString(),
            status: repo.status,
            access_level: repo.access_level || "restricted",
            abstract: repo.abstract || "",
          });
        }
      } catch (error) {
        if (error.response?.status === 403) {
           toast.error("Anda tidak memiliki akses ke repositori ini.");
           navigate("/dashboard/repositories");
        } else {
           toast.error("Gagal memuat data formular");
        }
      } finally {
        setLoading(false);
      }
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      if (isEdit) {
        // Edit currently only supports updating metadata (no file update logic mapped yet in backend)
        await repositoryService.updateRepository(id, form);
        toast.success("Repository berhasil diperbarui!");
      } else {
        if (!file) {
          toast.error("File dokumen wajib diunggah!");
          setSubmitLoading(false);
          return;
        }

        // Use FormData for file upload
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        formData.append("file", file);

        await repositoryService.createRepository(formData);
        toast.success("Repository berhasil disimpan!");
      }

      navigate("/dashboard/repositories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan repositori");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 pb-24 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/repositories">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
               {isEdit ? "Edit Karya Ilmiah" : "Unggah Karya Ilmiah"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
               {isEdit ? "Perbarui metadata dokumen yang telah diunggah." : "Lengkapi formulir di bawah ini dengan metadata dokumen yang valid."}
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
             <Info className="w-4 h-4" /> Form Metadata
           </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Helper Alert */}
        <div className="p-4 bg-orange-50/80 border border-orange-100 rounded-xl flex gap-3 text-orange-800 text-sm shadow-sm">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-orange-500" />
          <div className="leading-relaxed">
            <strong className="block mb-1 font-semibold text-orange-900">Perhatikan Sebelum Mengunggah</strong>
            Pastikan nama penulis dan Dosen Pembimbing ditulis beserta gelar lengkap. File PDF yang diunggah harus mencakup halaman sampul hingga daftar pustaka dan lampiran yang diizinkan untuk dibaca publik.
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Top Metadata Section */}
          <div className="space-y-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" /> Informasi Utama
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Karya Ilmiah <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul lengkap dokumen..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Penulis Utama <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Nama penulis beserta gelar"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">NPM / NIDN <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="npm_nidn"
                    value={form.npm_nidn}
                    onChange={handleChange}
                    placeholder="Nomor identitas penulis"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Abstrak (ID/EN)</label>
                  <textarea
                    name="abstract"
                    value={form.abstract}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tuliskan abstrak dari karya ilmiah ini..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800 resize-y leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" /> Dosen Pembimbing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pembimbing 1 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="pembimbing1"
                    value={form.pembimbing1}
                    onChange={handleChange}
                    placeholder="Nama Pembimbing 1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pembimbing 2 (Opsional)</label>
                  <input
                    type="text"
                    name="pembimbing2"
                    value={form.pembimbing2}
                    onChange={handleChange}
                    placeholder="Nama Pembimbing 2"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sections: Categories & Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-500" /> Kategori & Status
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Program Studi <span className="text-red-500">*</span></label>
                <select
                  name="prodi_id"
                  value={form.prodi_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800 cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Pilih Prodi --</option>
                  {activeProdis.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jenis Dokumen <span className="text-red-500">*</span></label>
                <select
                  name="doc_type_id"
                  value={form.doc_type_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800 cursor-pointer"
                  required
                >
                   <option value="" disabled>-- Pilih Jenis --</option>
                   {activeDocTypes.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                   ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tahun <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800 cursor-pointer"
                    required
                  >
                    <option value="draft">Draft (Simpan)</option>
                    <option value="pending review">Submit Review</option>
                    <option value="published" disabled={user?.role?.slug === "mahasiswa"}>Published</option>
                    <option value="archived" disabled={user?.role?.slug === "mahasiswa"}>Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hak Akses <span className="text-red-500">*</span></label>
                <select
                  name="access_level"
                  value={form.access_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-slate-800 cursor-pointer"
                  required
                >
                  <option value="public">Public (Terbuka)</option>
                  <option value="restricted">Restricted (Login)</option>
                  <option value="private">Private (Admin/Pemilik)</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-500" /> File Lampiran
              </h3>
              <div className="group flex justify-center px-6 pt-6 pb-8 border-2 border-slate-200 border-dashed rounded-xl hover:bg-orange-50/50 hover:border-orange-300 transition-colors cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange} 
                />
                <div className="space-y-3 text-center pointer-events-none">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-orange-500" />
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-orange-600">Klik untuk unggah</span> atau drag and drop
                  </div>
                  <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 20MB</p>
                  
                  {file && (
                    <div className="pt-2">
                       <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200/50 max-w-full truncate">
                         {file.name}
                       </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 px-2">
          <Link to="/dashboard/repositories">
            <Button type="button" variant="outline" className="w-full sm:w-auto hover:bg-slate-50" disabled={submitLoading}>Batalkan</Button>
          </Link>
          <Button type="submit" disabled={submitLoading} className="gap-2 text-white bg-orange-600 hover:bg-orange-700">
            {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {form.status === "Pending Review" ? "Kirim ke Pembimbing" : isEdit ? "Simpan Perbaikan" : "Simpan Dokumen"}
          </Button>
        </div>
      </form>
    </div>
  );
}
