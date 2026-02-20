import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Download, Users, Layers, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import RepositoryCard from "@/components/repository/RepositoryCard";
import repositoryService from "@/services/repositoryService";
import dashboardService from "@/services/dashboardService";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [latestRepos, setLatestRepos] = useState([]);
  const [stats, setStats] = useState({
    totalRepositories: 0,
    totalDownloads: 0,
    totalUsers: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [repoRes, statsRes] = await Promise.all([
          repositoryService.getRepositories({ page: 1, limit: 4 }),
          dashboardService.getStats(),
        ]);

        if (repoRes.data) {
          setLatestRepos(repoRes.data);
        }

        if (statsRes.success) {
          setStats({
            totalRepositories: statsRes.stats.totalPublished || 0,
            totalDownloads: statsRes.stats.totalDownloads || 0,
            totalUsers: statsRes.stats.totalUsers || 0,
            totalCategories: statsRes.barData?.length || 0, // Using prodi count as categories
          });
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      navigate(`/repositories?q=${encodeURIComponent(val.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/repositories?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const statItems = [
    {
      icon: BookOpen,
      value: stats.totalRepositories.toLocaleString(),
      label: "Total Repositori",
      color: "#F97316",
    },
    {
      icon: Download,
      value: stats.totalDownloads.toLocaleString(),
      label: "Total Unduhan",
      color: "#10B981",
    },
    {
      icon: Users,
      value: stats.totalUsers.toLocaleString(),
      label: "Pengguna",
      color: "#8B5CF6",
    },
    {
      icon: Layers,
      value: stats.totalCategories.toLocaleString(),
      label: "Program Studi",
      color: "#F59E0B",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="homepage">
      {/* Hero Section */}
      <section className="hero-bg py-20 md:py-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-4 animate-fade-in-up">
              Repositori Akademik Digital
            </p>
            <h1
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-6 animate-fade-in-up animation-delay-100"
              data-testid="hero-title"
            >
              Jelajahi Karya
              <span className="text-[#F97316]"> Ilmiah</span>
            </h1>
            <p className="text-base md:text-lg text-[#334155] leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in-up animation-delay-200">
              Temukan, akses, dan unduh ribuan penelitian akademik dari berbagai
              disiplin ilmu dalam satu platform terpadu.
            </p>

            {/* Hero Search */}
            <div
              className="max-w-xl mx-auto animate-fade-in-up animation-delay-300"
              onKeyDown={handleKeyDown}
            >
              <SearchInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Cari judul, penulis, atau kata kunci..."
                variant="hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section
        className="py-16 md:py-20 bg-white"
        data-testid="statistics-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon
                    className="w-5 h-5"
                    style={{ color: stat.color }}
                  />
                </div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-[#0F172A] stat-number">
                  {stat.value}
                </p>
                <p className="text-sm text-[#64748B] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Repositories */}
      <section
        className="py-16 md:py-24 bg-[#F8FAFC]"
        data-testid="latest-repos-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-2">
                Terbaru
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight">
                Repositori Terkini
              </h2>
            </div>
            <Link to="/repositories" data-testid="view-all-repos-link">
              <Button
                variant="ghost"
                className="hidden sm:flex text-[#F97316] hover:text-[#ffc12fe7] hover:bg-[#F0F9FF] font-medium gap-2"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestRepos.map((repo, i) => (
              <div
                key={repo.id}
                className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`}
              >
                <RepositoryCard repository={repo} />
              </div>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/repositories" data-testid="view-all-repos-mobile">
              <Button
                variant="outline"
                className="border-[#F97316] text-[#F97316] hover:bg-[#F0F9FF]"
              >
                Lihat Semua Repositori
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

