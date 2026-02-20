import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookMarked,
  Users,
  Settings,
  LogOut,
  FolderTree,
  FileText,
  Clock,
  ShieldAlert,
  DownloadCloud
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { logout, hasPermission, user } = useAuth();

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  // Menu Definition based on roles/permissions
  const getMenuItems = () => {
    const items = [];

    // Overview & Analytics
    if (hasPermission("view_dashboard_all") || hasPermission("view_dashboard_prodi") || hasPermission("view_dashboard_dosen") || hasPermission("view_dashboard_mhs")) {
       items.push({ section: "Overview", items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" }] });
    }

    if (hasPermission("view_download_logs") || hasPermission("view_download_logs_prodi")) {
      const sectionIndex = items.findIndex(s => s.section === "Overview");
      if (sectionIndex > -1) {
        items[sectionIndex].items.push({ icon: DownloadCloud, label: "Download Logs", href: "/dashboard/logs/downloads" });
      }
    }

    // Repository Management
    const repoGroup = [];
    if (hasPermission("view_repo_all") || hasPermission("view_repo_prodi")) {
      repoGroup.push({ icon: BookMarked, label: "All Repositories", href: "/dashboard/repositories" });
    }
    
    // Mahasiswa & Dosen specific menus
    if (user?.role?.slug === "mahasiswa" || user?.role?.slug === "dosen") {
      repoGroup.push({ icon: FileText, label: "My Repositories", href: "/dashboard/repositories/my" });
    }

    // Approvals (Admin/Reviewer)
    if (hasPermission("approve_repo") || hasPermission("approve_repo_assigned")) {
      repoGroup.push({ icon: Clock, label: "Pending Approvals", href: "/dashboard/repositories/approvals" });
    }

    if (repoGroup.length > 0) {
      items.push({ section: "Repository", items: repoGroup });
    }

    // Master Data (Admin Only)
    if (hasPermission("manage_master_data")) {
      items.push({
        section: "Master Data",
        items: [
          { icon: FolderTree, label: "Program Studi", href: "/dashboard/master/programs" },
          { icon: FileText, label: "Jenis Dokumen", href: "/dashboard/master/doc-types" },
        ]
      });
    }

    // Settings & Users (Super Admin Only)
    if (hasPermission("manage_users") || hasPermission("manage_roles")) {
      const settingsGroup = [];
      if (hasPermission("manage_users")) {
        settingsGroup.push({ icon: Users, label: "Users", href: "/dashboard/users" });
      }
      if (hasPermission("manage_roles")) {
        settingsGroup.push({ icon: ShieldAlert, label: "Roles & Access", href: "/dashboard/roles" });
      }
      items.push({ section: "System Management", items: settingsGroup });
    }

    return items;
  };

  const menuSections = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 flex flex-col w-64 h-screen bg-slate-900 text-slate-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-slate-800 shrink-0">
          <div className="flex flex-col items-center leading-tight">
            <span className="text-xl font-bold tracking-wider text-orange-500">
              Admin Panel
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase">STIKes Bogor Husada</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto hide-scrollbar space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-4 mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                {section.section}
              </h3>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)} // cover mobile case
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      active
                        ? "bg-orange-500/10 text-orange-500 font-medium"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors rounded-lg hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}
