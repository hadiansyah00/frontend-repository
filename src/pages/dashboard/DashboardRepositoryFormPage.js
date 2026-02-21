import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, Info, Loader2 } from "lucide-react";
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/repositories">
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            {isEdit ? "Edit Repositori" : "Tambah Karya Ilmiah Baru"}
          </h2>
          <p className="text-sm text-slate-500">
            Lengkapi form di bawah ini dengan metadata dokumen yang valid.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <div className="md:col-span-2 p-4 bg-orange-50/50 border border-orange-100 rounded-lg flex gap-3 text-orange-800 text-sm">
              <Info className="w-5 h-5 shrink-0" />
              <p>Pastikan nama penulis dan Dosen Pembimbing ditulis beserta gelar lengkap. File PDF yang diunggah harus mencakup halaman sampul hingga daftar pustaka dan lampiran yang diizinkan publik.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Karya Ilmiah</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Penyusun / Penulis Utama</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NPM / NIDN</label>
              <input
                type="text"
                name="npm_nidn"
                value={form.npm_nidn}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosen Pembimbing 1</label>
              <input
                type="text"
                name="pembimbing1"
                value={form.pembimbing1}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                required
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosen Pembimbing 2 (Optional)</label>
              <input
                type="text"
                name="pembimbing2"
                value={form.pembimbing2}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
              <select
                name="prodi_id"
                value={form.prodi_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
                required
              >
                <option value="">-- Pilih Prodi --</option>
                {activeProdis.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Dokumen</label>
              <select
                name="doc_type_id"
                value={form.doc_type_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
                required
              >
                 <option value="">-- Pilih Jenis --</option>
                 {activeDocTypes.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                 ))}
              </select>
            </div>

             <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
                    required
                  >
                    <option value="draft">Draft (Simpan Sementara)</option>
                    <option value="pending review">Submit for Review</option>
                    
                    {/* Hanya admin/reviewer yang bisa set status ini langsung jika perlu */}
                    <option value="published" disabled={user?.role?.slug === "mahasiswa"}>Published (Live)</option>
                    <option value="archived" disabled={user?.role?.slug === "mahasiswa"}>Archived (Arsip)</option>
                  </select>
                </div>
             </div>


            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Abstrak (ID/EN)</label>
              <textarea
                name="abstract"
                value={form.abstract}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-y"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Unggah Dokumen Inti (PDF Berlapis Watermark jika ada)</label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50/50">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex justify-center text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white px-2 py-0.5 rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 border border-orange-200 shadow-sm">
                      <span>Browse file</span>
                      <input type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    </label>
                    <p className="pl-2 pt-0.5">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">Hanya format PDF, DOC, DOCX, Maks. 20MB</p>
                  {file && (
                    <p className="text-sm font-medium text-emerald-600 truncate max-w-xs mx-auto">
                      {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Link to="/dashboard/repositories">
            <Button type="button" variant="outline" disabled={submitLoading}>Batal</Button>
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
