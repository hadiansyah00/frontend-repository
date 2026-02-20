import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import SearchInput from "@/components/common/SearchInput";
import RepositoryCard from "@/components/repository/RepositoryCard";
import repositoryService from "@/services/repositoryService";
import masterDataService from "@/services/masterDataService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

export default function RepositoryListPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [prodiFilter, setProdiFilter] = useState("all");
  const [docTypeFilter, setDocTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [repositories, setRepositories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Master data for filters
  const [prodis, setProdis] = useState([]);
  const [docTypes, setDocTypes] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [prodiRes, docTypeRes] = await Promise.all([
          masterDataService.getProdis(),
          masterDataService.getDocTypes(),
        ]);
        setProdis(Array.isArray(prodiRes) ? prodiRes : prodiRes.data || []);
        setDocTypes(Array.isArray(docTypeRes) ? docTypeRes : docTypeRes.data || []);
      } catch (error) {
        console.error("Failed to fetch master data for filters:", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery,
          status: "published", // Only show published public repositories
        };

        if (prodiFilter !== "all") params.prodi_id = prodiFilter;
        if (docTypeFilter !== "all") params.doc_type_id = docTypeFilter;

        const res = await repositoryService.getRepositories(params);
        setRepositories(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.totalItems);
        }
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        toast.error("Gagal mengambil data repositori.");
      } finally {
        setLoading(false);
      }
    };

    // Implemented a tiny debounce effect to avoid spamming the API while typing
    const timeoutId = setTimeout(() => {
      fetchRepositories();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, prodiFilter, docTypeFilter, currentPage]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setProdiFilter("all");
    setDocTypeFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() || prodiFilter !== "all" || docTypeFilter !== "all";

  return (
    <div
      className="bg-[#F8FAFC] min-h-screen"
      data-testid="repository-list-page"
    >
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-2">
            Koleksi
          </p>
          <h1
            className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight"
            data-testid="repo-list-title"
          >
            Semua Repositori
          </h1>
          <p className="text-base text-[#334155] mt-2 max-w-2xl">
            Jelajahi koleksi lengkap karya ilmiah yang tersedia dalam repositori
            kami.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-16 z-40 bg-white/90 navbar-blur border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            {/* Search */}
            <div className="w-full md:flex-1">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari judul atau penulis..."
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter:</span>
              </div>

              <Select
                value={prodiFilter}
                onValueChange={(val) => { setProdiFilter(val); setCurrentPage(1); }}
                data-testid="prodi-filter"
              >
                <SelectTrigger
                  className="w-[180px] bg-white border-[#E2E8F0] text-sm"
                  data-testid="prodi-filter-trigger"
                >
                  <SelectValue placeholder="Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prodi</SelectItem>
                  {prodis.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={docTypeFilter}
                onValueChange={(val) => { setDocTypeFilter(val); setCurrentPage(1); }}
                data-testid="doctype-filter"
              >
                <SelectTrigger
                  className="w-[180px] bg-white border-[#E2E8F0] text-sm"
                  data-testid="doctype-filter-trigger"
                >
                  <SelectValue placeholder="Jenis Dokumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {docTypes.map((dt) => (
                    <SelectItem key={dt.id} value={String(dt.id)}>
                      {dt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#64748B] hover:text-[#0F172A] text-xs"
                  data-testid="clear-filters-btn"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-sm text-[#64748B] mb-6" data-testid="results-count">
              Menampilkan {repositories.length} hasil (Total {totalItems} repositori)
            </p>

            {repositories.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repositories.map((repo) => (
                    <RepositoryCard key={repo.id} repository={repo} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12" data-testid="pagination">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-40"
                                : "cursor-pointer"
                            }
                            data-testid="pagination-prev"
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                                data-testid={`pagination-page-${page}`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-40"
                                : "cursor-pointer"
                            }
                            data-testid="pagination-next"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20" data-testid="no-results">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                  <Filter className="w-7 h-7 text-[#94A3B8]" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#0F172A] mb-2">
                  Tidak ada hasil
                </h3>
                <p className="text-sm text-[#64748B] mb-6">
                  Tidak ditemukan repositori yang sesuai dengan pencarian Anda.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-[#F97316] hover:bg-[#ffc12fe7] text-white"
                  data-testid="reset-search-btn"
                >
                  Reset Pencarian
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

