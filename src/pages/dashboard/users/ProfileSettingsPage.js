import { useState, useEffect } from "react";
import { User, Lock, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/authService";

export default function ProfileSettingsPage() {
  const { user, login } = useAuth(); // login is usually just for updating AuthContext, we might need a fetchUser or we can update the user directly if AuthContext supports it. We'll refresh via window.location.reload() for simplicity if needed, or rely on the updated state.
  
  const [profileForm, setProfileForm] = useState({ name: "", nip: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", nip: user.nip || "" });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!profileForm.name) {
      toast.error("Nama Lengkap tidak boleh kosong");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await authService.updateProfile({
        name: profileForm.name,
        nip: profileForm.nip || null,
      });
      toast.success(res.message || "Profil berhasil diperbarui!");
      // Optionally we can refresh the page to update the context topbar
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setProfileLoading(false);
    }
  };

  const savePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Harap isi semua kolom password");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(res.message || "Password berhasil diubah!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Pengaturan Akun
        </h2>
        <p className="text-slate-500">Sesuaikan profil dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Edit Section */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Informasi Pribadi</h3>
              <p className="text-xs text-slate-500">Ubah nama dan data NIP Anda.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Login)</label>
              <input 
                type="text" 
                value={user?.email || ""} 
                disabled 
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input 
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIP / NPM</label>
              <input 
                name="nip"
                value={profileForm.nip}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all" 
                placeholder="Opsional"
              />
            </div>
            <div className="pt-2">
              <Button onClick={saveProfile} disabled={profileLoading} className="w-full gap-2 bg-orange-500 hover:bg-orange-600">
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Profil
              </Button>
            </div>
          </div>
        </div>

        {/* Password Edit Section */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Ubah Password</h3>
              <p className="text-xs text-slate-500">Perbarui kata sandi untuk keamanan akun.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password Saat Ini</label>
              <input 
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none transition-all" 
                placeholder="••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
              <input 
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none transition-all" 
                placeholder="Min. 6 karakter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
              <input 
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none transition-all" 
                placeholder="Ulangi password baru"
              />
            </div>
            <div className="pt-2">
              <Button onClick={savePassword} disabled={passwordLoading} className="w-full gap-2 bg-slate-900 hover:bg-slate-800">
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Ganti Password
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
