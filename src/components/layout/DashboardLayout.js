import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
          <div className="container px-4 py-8 mx-auto sm:px-6 md:px-8 max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
