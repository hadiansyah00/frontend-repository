import { Link } from "react-router-dom";
import { Download, ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RepositoryCard({ repository }) {
  const { id, title, author, year, abstract } = repository;

  return (
    <Card
      className="repo-card group border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
      data-testid={`repository-card-${id}`}
    >
      <CardContent className="p-6 md:p-7 flex flex-col h-full">
        {/* Year Badge + Downloads */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className="bg-[#FFF7ED] text-[#F97316] border-0 font-semibold text-xs px-2.5 py-1"
            data-testid={`card-year-${id}`}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {year || "-"}
          </Badge>
          {/* Download count is currently not included in the list API response, so omitting it or leaving static for now */}
        </div>

        {/* Title */}
        <h3
          className="font-serif text-lg font-bold text-[#0F172A] leading-snug mb-2 line-clamp-2 group-hover:text-[#F97316] transition-colors duration-200"
          data-testid={`card-title-${id}`}
        >
          {title}
        </h3>

        {/* Author */}
        <p
          className="text-sm text-[#64748B] mb-3"
          data-testid={`card-author-${id}`}
        >
          {author}
        </p>

        {/* Abstract */}
        <p
          className="text-sm text-[#334155] leading-relaxed line-clamp-3 mb-5 flex-1"
          data-testid={`card-abstract-${id}`}
        >
          {abstract || "Tidak ada abstrak."}
        </p>

        {/* Action */}
        <Link to={`/repository/${id}`} data-testid={`card-detail-btn-${id}`}>
          <Button
            variant="ghost"
            className="w-full justify-between text-[#F97316] hover:text-[#EA580C] hover:bg-[#FFF7ED] font-medium text-sm h-10 px-4"
          >
            Lihat Detail
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

