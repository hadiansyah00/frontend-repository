import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Repositori", href: "/repositories" },
  { label: "Tentang", href: "/about" },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#E2E8F0]/60 bg-white/80 navbar-blur"
      data-testid="navbar"
    >
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          data-testid="navbar-logo"
        >
          {/* Logo */}
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden transition-transform duration-300 rounded-lg group-hover:scale-105">
            <img
              src="/images/logo/stikes-bogor-husda.png"
              alt="Logo STIKes Bogor Husada"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide text-gray-900">
              Repository
            </span>

            <span className="text-xs font-medium tracking-wide text-gray-500">
              STIKes Bogor Husada
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="items-center hidden gap-1 md:flex"
          data-testid="navbar-desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#F97316] bg-[#F0F9FF]"
                    : "text-[#334155] hover:text-[#F97316] hover:bg-[#F8FAFC]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-testid="mobile-menu-trigger"
              >
                <Menu className="w-5 h-5 text-[#334155]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#F97316]" />
                  <span className="font-serif">Scholar</span>
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 mt-8"
                data-testid="navbar-mobile-nav"
              >
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      className={`px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-[#F97316] bg-[#F0F9FF]"
                          : "text-[#334155] hover:text-[#F97316] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
