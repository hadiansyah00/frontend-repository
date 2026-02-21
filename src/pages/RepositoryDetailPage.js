import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Calendar,
  User,
  FileText,
  Clock,
  Shield,
  BookOpen,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import repositoryService from "@/services/repositoryService";
import { useAuth } from "@/contexts/AuthContext";

export default function RepositoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const data = await repositoryService.getPublicRepositoryById(id);
        setRepo(data);
      } catch (error) {
        console.error("Failed to fetch repository details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
      </div>
    );
  }

  if (!repo) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"
        data-testid="repo-not-found"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-[#94A3B8]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-2">
            Repositori Tidak Ditemukan
          </h2>
          <p className="text-sm text-[#64748B] mb-6">
            Maaf, repositori yang Anda cari tidak tersedia.
          </p>
          <Link to="/repositories">
            <Button className="bg-[#F97316] hover:bg-[#ffc12fe7] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // 1. If public, anyone can download using the public endpoint without a token.
    if (repo.access_level === "public") {
      toast.success("Unduhan dimulai", { description: `Mengunduh "${repo.title}"` });
      const url = repositoryService.getPublicDownloadUrl(id);
      window.open(url, "_blank");
      return;
    }

    // 2. If restricted or private, user must be logged in.
    if (!isAuthenticated) {
      toast.error("Harap login terlebih dahulu untuk mengunduh dokumen.");
      navigate("/login");
      return;
    }

    // 3. If private, check if user is the owner or an admin (role check)
    // Here we do a basic client-side check. The backend also enforces this.
    if (repo.access_level === "private") {
      const isOwner = user?.id === repo.uploaded_by;
      const isAdmin = user?.role?.slug !== "mahasiswa" && user?.role?.slug !== "dosen";
      if (!isOwner && !isAdmin) {
         toast.error("Akses Ditolak", { description: "Dokumen ini bersifat privat dan hanya bisa diakses oleh pemilik atau admin." });
         return;
      }
    }

    // Proceed with authenticated download
    const token = localStorage.getItem("auth_token");
    toast.success("Unduhan dimulai", {
      description: `Mengunduh "${repo.title}"`,
    });

    const url = repositoryService.getDownloadUrl(id);
    const downloadUrl = `${url}?token=${token}`;
    
    // Open in new tab which will trigger the browser download due to content-disposition
    window.open(downloadUrl, "_blank");
  };

  const getAccessBadgeDisplay = () => {
    switch(repo.access_level) {
      case "public": return { label: "Public", className: "bg-emerald-50 text-emerald-600 border-0" };
      case "private": return { label: "Private", className: "bg-red-50 text-red-600 border-0" };
      case "restricted": default: return { label: "Restricted", className: "bg-amber-50 text-amber-600 border-0" };
    }
  };

  const accessBadge = getAccessBadgeDisplay();

  const isDownloadDisabled = () => {
    if (repo.access_level === "public") return false;
    if (!isAuthenticated) return true;
    if (repo.access_level === "private") {
      const isOwner = user?.id === repo.uploaded_by;
      const isAdmin = user?.role?.slug !== "mahasiswa" && user?.role?.slug !== "dosen";
      if (!isOwner && !isAdmin) return true;
    }
    return false;
  };

  const metaItems = [
    {
      icon: User,
      label: "Penulis",
      value: repo.author,
    },
    {
      icon: Calendar,
      label: "Tahun",
      value: repo.year || "-",
    },
    {
      icon: Clock,
      label: "Tanggal Terbit",
      value: repo.createdAt || repo.created_at ? new Date(repo.createdAt || repo.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) : "-",
    },
    {
      icon: Shield,
      label: "Jenis Akses",
      value: accessBadge.label,
    },
    {
      icon: Download,
      label: "Jumlah Unduhan",
      value: (repo.download_count || 0).toLocaleString(),
    },
    {
      icon: FileText,
      label: "Kategori",
      value: repo.docType?.name || "Lainnya",
    },
  ];

  return (
    <div
      className="bg-[#F8FAFC] min-h-screen"
      data-testid="repository-detail-page"
    >
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/repositories"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F97316] transition-colors mb-6"
            data-testid="back-to-list-link"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Repositori
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-[#F0F9FF] text-[#F97316] border-0 font-semibold text-xs"
                  data-testid="detail-year-badge"
                >
                  {repo.year || "-"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`${accessBadge.className} text-xs`}
                  data-testid="detail-access-badge"
                >
                  {accessBadge.label}
                </Badge>
                {repo.prodi && (
                  <Badge variant="outline" className="text-xs text-[#64748B]">
                    {repo.prodi.name}
                  </Badge>
                )}
              </div>

              <h1
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight"
                data-testid="detail-title"
              >
                {repo.title}
              </h1>

              <p
                className="text-base text-[#64748B] mt-3"
                data-testid="detail-author"
              >
                oleh{" "}
                <span className="font-medium text-[#334155]">
                  {repo.author}
                </span>
              </p>
            </div>

            <Button
              onClick={handleDownload}
              disabled={isDownloadDisabled()}
              className={`font-medium h-11 px-6 shadow-sm transition-all duration-200 shrink-0 ${
                isDownloadDisabled() 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-[#F97316] hover:bg-[#ffc12fe7] text-white hover:shadow-md hover:scale-[1.02]"
              }`}
              data-testid="download-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              {repo.access_level !== "public" && !isAuthenticated ? "Login untuk Mengunduh" : "Unduh Dokumen"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <Card className="border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6 md:p-8">
                <h2 className="font-serif text-xl font-semibold text-[#0F172A] mb-4">
                  Abstrak
                </h2>
                <p
                  className="text-[#334155] leading-relaxed text-base"
                  data-testid="detail-abstract"
                >
                  {repo.abstract || "Tidak ada rincian abstrak disertakan."}
                </p>
              </CardContent>
            </Card>

            {/* Document Preview is simplified to just info box because actual PDF inline preview requires full token integration.
                Plus "Pratinjau tidak tersedia dalam mode demo" is already there. */}
            <Card className="border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6 md:p-8">
                <h2 className="font-serif text-xl font-semibold text-[#0F172A] mb-4">
                  Pratinjau Dokumen
                </h2>
                <div
                  className="relative aspect-[4/3] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pdf-preview-area flex items-center justify-center overflow-hidden"
                  data-testid="pdf-preview-area"
                >
                  <div className="text-center z-10 bg-[#F8FAFC]/80 p-8 rounded-xl">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <FileText className="w-7 h-7 text-[#94A3B8]" />
                    </div>
                    <p className="text-sm font-medium text-[#334155] mb-1">
                      {repo.file_name || "Pratinjau PDF"}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      Pratinjau tidak tersedia saat ini. Silakan unduh dokumen untuk melihat isinya.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Metadata */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-[#0F172A] mb-5">
                    Informasi Metadata
                  </h3>

                  <div className="space-y-4">
                    {metaItems.map((item, index) => (
                      <div key={item.label}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-md bg-[#F1F5F9] flex items-center justify-center shrink-0 mt-0.5">
                            <item.icon className="w-4 h-4 text-[#64748B]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide">
                              {item.label}
                            </p>
                            <p
                              className="text-sm text-[#0F172A] font-medium mt-0.5"
                              data-testid={`meta-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {item.value}
                            </p>
                          </div>
                        </div>
                        {index < metaItems.length - 1 && (
                          <Separator className="mt-4 bg-[#F1F5F9]" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-5 bg-[#F1F5F9]" />

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloadDisabled()}
                    className={`w-full font-medium h-11 shadow-sm transition-all duration-200 ${
                       isDownloadDisabled() 
                         ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                         : "bg-[#F97316] hover:bg-[#ffc12fe7] text-white hover:shadow-md"
                    }`}
                    data-testid="sidebar-download-btn"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {repo.access_level !== "public" && !isAuthenticated ? "Login untuk Unduh" : "Unduh PDF"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

