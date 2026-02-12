import { Link } from "react-router-dom";
import { Download, ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RepositoryCard({ repository }) {
  const { slug, judul, penulis, tahun, abstrak, downloads } = repository;

  return (
    <Card
      className="repo-card group border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
      data-testid={`repository-card-${slug}`}
    >
      <CardContent className="p-6 md:p-7 flex flex-col h-full">
        {/* Year Badge + Downloads */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className="bg-[#F0F9FF] text-[#0EA5E9] border-0 font-semibold text-xs px-2.5 py-1"
            data-testid={`card-year-${slug}`}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {tahun}
          </Badge>
          <span
            className="flex items-center gap-1 text-xs text-[#64748B]"
            data-testid={`card-downloads-${slug}`}
          >
            <Download className="w-3.5 h-3.5" />
            {downloads.toLocaleString()}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-serif text-lg font-bold text-[#0F172A] leading-snug mb-2 line-clamp-2 group-hover:text-[#0EA5E9] transition-colors duration-200"
          data-testid={`card-title-${slug}`}
        >
          {judul}
        </h3>

        {/* Author */}
        <p
          className="text-sm text-[#64748B] mb-3"
          data-testid={`card-author-${slug}`}
        >
          {penulis}
        </p>

        {/* Abstract */}
        <p
          className="text-sm text-[#334155] leading-relaxed line-clamp-3 mb-5 flex-1"
          data-testid={`card-abstract-${slug}`}
        >
          {abstrak}
        </p>

        {/* Action */}
        <Link to={`/repository/${slug}`} data-testid={`card-detail-btn-${slug}`}>
          <Button
            variant="ghost"
            className="w-full justify-between text-[#0EA5E9] hover:text-[#0284C7] hover:bg-[#F0F9FF] font-medium text-sm h-10 px-4"
          >
            Lihat Detail
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
