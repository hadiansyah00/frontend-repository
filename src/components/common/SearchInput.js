import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari repositori...",
  variant = "standard",
  className = "",
}) {
  const isHero = variant === "hero";

  return (
    <div
      className={`relative search-glow rounded-md transition-shadow duration-200 ${className}`}
      data-testid="search-input-wrapper"
    >
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] ${
          isHero ? "w-5 h-5" : "w-4 h-4"
        }`}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid="search-input"
        className={`border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#0EA5E9] ${
          isHero
            ? "h-14 pl-12 pr-12 text-base rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            : "h-10 pl-10 pr-10 text-sm"
        }`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] transition-colors`}
          data-testid="search-clear-btn"
        >
          <X className={isHero ? "w-5 h-5" : "w-4 h-4"} />
        </button>
      )}
    </div>
  );
}
