import { useState } from "react";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const ALL_AVAILABLE_PERMISSIONS = [
  { id: "view_dashboard_all", name: "View Dashboard (All)" },
  { id: "view_dashboard_prodi", name: "View Dashboard (Prodi)" },
  { id: "view_dashboard_dosen", name: "View Dashboard (Dosen)" },
  { id: "view_dashboard_mhs", name: "View Dashboard (Mahasiswa)" },
  { id: "manage_users", name: "Manage Users" },
  { id: "manage_roles", name: "Manage Roles & Permissions" },
  { id: "manage_master_data", name: "Manage Master Data" },
  { id: "view_download_logs", name: "View Download Logs (All)" },
  { id: "view_download_logs_prodi", name: "View Download Logs (Prodi)" },
  { id: "view_repo_all", name: "View All Repositories" },
  { id: "view_repo_prodi", name: "View Prodi Repositories" },
  { id: "manage_repo_all", name: "Manage All Repositories" },
  { id: "manage_repo_prodi", name: "Manage Prodi Repositories" },
  { id: "create_repo", name: "Create Repository" },
  { id: "edit_own_repo", name: "Edit Own Repository" },
  { id: "approve_repo", name: "Approve Any Repository" },
  { id: "approve_repo_assigned", name: "Approve Assigned Repository" },
  { id: "delete_repo", name: "Delete Repository" }
];

export default function RoleAccessPage() {
  const { DUMMY_ROLES } = useAuth();
  const [selectedRole, setSelectedRole] = useState(DUMMY_ROLES.SUPER_ADMIN);

  // Mock initial permissions based on selected role
  // In a real app, this would come from an API
  const getMockRolePermissions = (role) => {
    switch(role) {
      case DUMMY_ROLES.SUPER_ADMIN: return ["view_dashboard_all", "manage_users", "manage_roles", "manage_master_data", "view_download_logs", "view_repo_all", "manage_repo_all", "approve_repo", "delete_repo"];
      case DUMMY_ROLES.ADMIN_PRODI: return ["view_dashboard_prodi", "view_repo_prodi", "manage_repo_prodi", "approve_repo", "view_download_logs_prodi"];
      case DUMMY_ROLES.DOSEN: return ["view_dashboard_dosen", "view_repo_all", "create_repo", "edit_own_repo", "approve_repo_assigned"];
      case DUMMY_ROLES.MAHASISWA: return ["view_dashboard_mhs", "view_repo_all", "create_repo", "edit_own_repo"];
      default: return [];
    }
  };

  const [currentRolePerms, setCurrentRolePerms] = useState(getMockRolePermissions(selectedRole));

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentRolePerms(getMockRolePermissions(role));
  };

  const handleTogglePermission = (permId) => {
    if (selectedRole === DUMMY_ROLES.SUPER_ADMIN) {
        // Prevent editing Super Admin for safety in demo
        return;
    }
    
    if (currentRolePerms.includes(permId)) {
       setCurrentRolePerms(currentRolePerms.filter(p => p !== permId));
    } else {
       setCurrentRolePerms([...currentRolePerms, permId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Roles & Permissions
          </h2>
          <p className="text-slate-500">Atur hak akses (permissions) untuk setiap role di sistem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Roles Sidebar */}
         <div className="md:col-span-1 space-y-2">
            <h3 className="font-semibold text-slate-700 mb-3 px-1">Pilih Role</h3>
            {Object.values(DUMMY_ROLES).map(role => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedRole === role 
                   ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                   : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Shield className={`w-4 h-4 ${selectedRole === role ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{role}</span>
              </button>
            ))}
         </div>

         {/* Permissions Matrix */}
         <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                 <h3 className="text-lg font-semibold text-slate-800">
                   Permissions untuk: <span className="text-orange-600">{selectedRole}</span>
                 </h3>
                 {selectedRole === DUMMY_ROLES.SUPER_ADMIN && (
                    <p className="text-xs text-red-500 mt-1">Role Super Admin tidak dapat diubah hak aksesnya.</p>
                 )}
              </div>
              <Button 
                disabled={selectedRole === DUMMY_ROLES.SUPER_ADMIN}
                className="bg-slate-900 hover:bg-slate-800"
              >
                Simpan Konfigurasi
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
               {ALL_AVAILABLE_PERMISSIONS.map(perm => {
                 const isChecked = currentRolePerms.includes(perm.id);
                 const isDisabled = selectedRole === DUMMY_ROLES.SUPER_ADMIN;

                 return (
                   <label 
                     key={perm.id} 
                     className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                       isChecked ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                     } ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                   >
                     <div className="flex items-center h-5 mt-0.5">
                       <input
                         type="checkbox"
                         className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-600"
                         checked={isChecked}
                         onChange={() => handleTogglePermission(perm.id)}
                         disabled={isDisabled}
                       />
                     </div>
                     <div className="flex flex-col">
                       <span className={`text-sm font-medium ${isChecked ? 'text-orange-900' : 'text-slate-700'}`}>
                         {perm.name}
                       </span>
                       <span className="text-xs text-slate-500 font-mono mt-1">
                         {perm.id}
                       </span>
                     </div>
                   </label>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
}
