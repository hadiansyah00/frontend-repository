import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
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
import { repositories, getAuthors, getYears } from "@/data/repositories";

const ITEMS_PER_PAGE = 6;

export default function RepositoryListPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [yearFilter, setYearFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const authors = getAuthors();
  const years = getYears();

  const filteredRepos = useMemo(() => {
    let result = [...repositories];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.judul.toLowerCase().includes(q) ||
          r.penulis.toLowerCase().includes(q) ||
          r.abstrak.toLowerCase().includes(q),
      );
    }

    if (yearFilter !== "all") {
      result = result.filter((r) => r.tahun === parseInt(yearFilter));
    }

    if (authorFilter !== "all") {
      result = result.filter((r) => r.penulis === authorFilter);
    }

    return result;
  }, [searchQuery, yearFilter, authorFilter]);

  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val) => {
    setYearFilter(val);
    setCurrentPage(1);
  };

  const handleAuthorChange = (val) => {
    setAuthorFilter(val);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setYearFilter("all");
    setAuthorFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() || yearFilter !== "all" || authorFilter !== "all";

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
                placeholder="Cari judul, penulis, atau abstrak..."
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter:</span>
              </div>

              <Select
                value={yearFilter}
                onValueChange={handleYearChange}
                data-testid="year-filter"
              >
                <SelectTrigger
                  className="w-[130px] bg-white border-[#E2E8F0] text-sm"
                  data-testid="year-filter-trigger"
                >
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={authorFilter}
                onValueChange={handleAuthorChange}
                data-testid="author-filter"
              >
                <SelectTrigger
                  className="w-[180px] bg-white border-[#E2E8F0] text-sm"
                  data-testid="author-filter-trigger"
                >
                  <SelectValue placeholder="Penulis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Penulis</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
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
        {/* Count */}
        <p className="text-sm text-[#64748B] mb-6" data-testid="results-count">
          Menampilkan {paginatedRepos.length} dari {filteredRepos.length}{" "}
          repositori
        </p>

        {paginatedRepos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRepos.map((repo) => (
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
              className="bg-[#F97316] hover:bg-[#0284C7] text-white"
              data-testid="reset-search-btn"
            >
              Reset Pencarian
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
