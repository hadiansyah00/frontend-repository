import { useState, useEffect } from "react";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import roleService from "@/services/roleService";

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
  { id: "manage_repositories", name: "Manage All Repositories" },
  { id: "manage_repo_prodi", name: "Manage Prodi Repositories" },
  { id: "create_repo", name: "Create Repository" },
  { id: "edit_own_repo", name: "Edit Own Repository" },
  { id: "approve_repo", name: "Approve Any Repository" },
  { id: "approve_repo_assigned", name: "Approve Assigned Repository" },
  { id: "delete_repo", name: "Delete Repository" }
];

export default function RoleAccessPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentRolePerms, setCurrentRolePerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await roleService.getRoles();
      const rolesData = Array.isArray(res) ? res : res.data || [];
      setRoles(rolesData);
      
      if (rolesData.length > 0) {
        handleRoleChange(rolesData[0]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Gagal mengambil data role.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const perms = role.permissions || [];
    // Map backend objects [{ id: 1, name: 'manage_users' }] to array of strings ['manage_users']
    const flatPerms = perms.map(p => typeof p === 'object' ? (p.name || p.id) : p);
    setCurrentRolePerms(flatPerms);
  };

  const handleTogglePermission = (permId) => {
    if (selectedRole?.name === "Super Admin") {
        // Prevent editing Super Admin for safety
        return;
    }
    
    if (currentRolePerms.includes(permId)) {
       setCurrentRolePerms(currentRolePerms.filter(p => p !== permId));
    } else {
       setCurrentRolePerms([...currentRolePerms, permId]);
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    
    setSaving(true);
    try {
      await roleService.updateRolePermissions(selectedRole.id, currentRolePerms);
      toast.success(`Permissions untuk role "${selectedRole.name}" berhasil disimpan.`);
      
      // Update local state roles array to reflect changes seamlessly
      setRoles(roles.map(r => 
        r.id === selectedRole.id ? { ...r, permissions: currentRolePerms.map(permName => ({ name: permName })) } : r
      ));
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan konfigurasi permissions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

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
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedRole?.id === role.id 
                   ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                   : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Shield className={`w-4 h-4 ${selectedRole?.id === role.id ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{role.name}</span>
              </button>
            ))}
         </div>

         {/* Permissions Matrix */}
         <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-6">
            {selectedRole ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Permissions untuk: <span className="text-orange-600">{selectedRole.name}</span>
                    </h3>
                    {selectedRole.name === "Super Admin" && (
                        <p className="text-xs text-red-500 mt-1">Role Super Admin tidak dapat diubah hak aksesnya.</p>
                    )}
                  </div>
                  <Button 
                    disabled={selectedRole.name === "Super Admin" || saving}
                    onClick={handleSave}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Simpan Konfigurasi
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                  {ALL_AVAILABLE_PERMISSIONS.map(perm => {
                    const isChecked = currentRolePerms.includes(perm.id);
                    const isDisabled = selectedRole.name === "Super Admin" || saving;

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
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Pilih role di sebelah kiri untuk melihat dan mengatur permissions.
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
