import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardTopbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm border-slate-200 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold sm:text-xl text-slate-800">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
         <Link to="/">
           <span className="hidden text-sm md:block text-slate-500 hover:text-orange-500">Back to Website</span>
         </Link>
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end hidden sm:flex">
             <span className="text-sm font-medium text-slate-900">
               {user?.name || "Admin"}
             </span>
             <span className="text-xs text-slate-500">{user?.role?.name || "Admin"}</span>
          </div>
          <img
            src={user?.avatar || "https://i.pravatar.cc/150"}
            alt="Avatar"
            className="object-cover w-9 h-9 rounded-full ring-2 ring-slate-100"
          />
        </div>
      </div>
    </header>
  );
}
