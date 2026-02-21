import "@/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import RoleRoute from "@/components/auth/RoleRoute";

// Public Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AboutPage from "@/pages/AboutPage";
import RepositoryListPage from "@/pages/RepositoryListPage";
import RepositoryDetailPage from "@/pages/RepositoryDetailPage";

// Dashboard Pages
import DashboardHomePage from "@/pages/dashboard/DashboardHomePage";
import DashboardRepositoryListPage from "@/pages/dashboard/DashboardRepositoryListPage";
import DashboardRepositoryFormPage from "@/pages/dashboard/DashboardRepositoryFormPage";
import ApprovalListPage from "@/pages/dashboard/approvals/ApprovalListPage";
import ProgramStudiPage from "@/pages/dashboard/master/ProgramStudiPage";
import DocTypePage from "@/pages/dashboard/master/DocTypePage";
import UserListPage from "@/pages/dashboard/users/UserListPage";
import RoleAccessPage from "@/pages/dashboard/users/RoleAccessPage";
import ProfileSettingsPage from "@/pages/dashboard/users/ProfileSettingsPage";
import DownloadLogsPage from "@/pages/dashboard/logs/DownloadLogsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Navbar Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/repositories" element={<RepositoryListPage />} />
            <Route path="/repository/:id" element={<RepositoryDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Hanya yg blm login bisa akses Login/Register */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          </Route>

          {/* Admin / Dashboard Routes with Sidebar Topbar */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHomePage />} />
            
            {/* Repository Routes */}
            <Route 
               path="repositories" 
               element={
                 <RoleRoute permission={["view_repo_all", "view_repo_prodi"]}>
                   <DashboardRepositoryListPage />
                 </RoleRoute>
               } 
            />
            <Route 
               path="repositories/my" 
               element={
                 <RoleRoute permission={["create_repo"]}>
                   <DashboardRepositoryListPage isMyRepo={true} />
                 </RoleRoute>
               } 
            />
            <Route 
               path="repositories/new" 
               element={
                 <RoleRoute permission={["create_repo"]}>
                   <DashboardRepositoryFormPage />
                 </RoleRoute>
               } 
            />
            <Route 
               path="repositories/:id/edit" 
               element={
                 <RoleRoute permission={["edit_own_repo", "manage_repositories", "manage_repo_prodi"]}>
                   <DashboardRepositoryFormPage />
                 </RoleRoute>
               } 
            />

            {/* Approvals */}
            <Route 
               path="repositories/approvals" 
               element={
                 <RoleRoute permission={["approve_repo", "approve_repo_assigned"]}>
                   <ApprovalListPage />
                 </RoleRoute>
               } 
            />

            {/* Master Data */}
            <Route 
               path="master/programs" 
               element={
                 <RoleRoute permission={["manage_master_data"]}>
                   <ProgramStudiPage />
                 </RoleRoute>
               } 
            />
            <Route 
               path="master/doc-types" 
               element={
                 <RoleRoute permission={["manage_master_data"]}>
                   <DocTypePage />
                 </RoleRoute>
               } 
            />

            {/* User Management & Security */}
            <Route 
               path="users" 
               element={
                 <RoleRoute permission={["manage_users"]}>
                   <UserListPage />
                 </RoleRoute>
               } 
            />
            <Route 
               path="roles" 
               element={
                 <RoleRoute permission={["manage_roles"]}>
                   <RoleAccessPage />
                 </RoleRoute>
               } 
            />
            <Route 
               path="logs/downloads" 
               element={
                 <RoleRoute permission={["view_download_logs", "view_download_logs_prodi"]}>
                   <DownloadLogsPage />
                 </RoleRoute>
               } 
            />
            
            {/* User Settings / Profile */}
            <Route 
               path="settings" 
               element={
                 <ProfileSettingsPage />
               } 
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
