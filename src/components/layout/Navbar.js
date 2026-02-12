import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, User } from "lucide-react";
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

  // 🔥 nanti ganti dari context / redux / auth hook
  const isLogin = false;

  const isActivePath = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden transition-transform duration-300 rounded-xl group-hover:scale-105">
            <img
              src="/images/logo/stikes-bogor-husda.png"
              alt="Logo STIKes Bogor Husada"
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide text-slate-900">
              Repository
            </span>
            <span className="text-xs font-medium tracking-wide text-slate-500">
              STIKes Bogor Husada
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = isActivePath(link.href);

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-orange-500 bg-orange-50"
                    : "text-slate-600 hover:text-orange-500 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth */}
        <div className="items-center hidden gap-2 md:flex">
          {isLogin ? (
            <Button variant="ghost" className="gap-2">
              <User className="w-4 h-4" />
              My Account
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>

              <Link to="/register">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5 text-slate-700" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  Repository
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => {
                  const isActive = isActivePath(link.href);

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Auth */}
                <div className="pt-4 mt-4 border-t">
                  {isLogin ? (
                    <Button className="w-full gap-2">
                      <User className="w-4 h-4" />
                      My Account
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>

                      <Link to="/register" onClick={() => setOpen(false)}>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
