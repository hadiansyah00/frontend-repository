import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer
      className="bg-[#F8FAFC] border-t border-[#E2E8F0]"
      data-testid="footer"
    >
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
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

            <p className="text-sm text-[#64748B] leading-relaxed max-w-xs">
              Repositori akademik digital untuk mengelola dan berbagi karya
              ilmiah dengan mudah dan terbuka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#334155] hover:text-[#F97316] transition-colors"
                  data-testid="footer-link-beranda"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/repositories"
                  className="text-sm text-[#334155] hover:text-[#F97316] transition-colors"
                  data-testid="footer-link-repositori"
                >
                  Repositori
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-[#334155] hover:text-[#F97316] transition-colors"
                  data-testid="footer-link-tentang"
                >
                  Tentang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-4">
              Kontak
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-[#334155]">perpustakaan@sbh.ac.id</li>
              <li className="text-sm text-[#334155]">0811-1011-1560</li>
              <li className="text-sm text-[#334155]">
                Jl. Sholeh Iskandar No.4, Kedungbadak, Kec. Tanah Sereal, Kota
                Bogor, Jawa Barat 16164
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-[#E2E8F0]" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[#64748B]" data-testid="footer-copyright">
            &copy; {new Date().getFullYear()} Repository STIKes Bogor Husada.
            All rights reserved.
          </p>
          <p className="text-xs text-[#94A3B8]">
            Built for academic excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
