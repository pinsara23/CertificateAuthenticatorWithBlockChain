import { AnimatePresence } from "framer-motion";
import { GraduationCap, LayoutDashboard, LogIn, SearchCheck } from "lucide-react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { AdminIssuePage, AdminLoginPage, DownloadPage, VerifyPage } from "./pages/index";

const navItems = [
  { to: "/", label: "Verify", icon: SearchCheck },
  { to: "/download", label: "Download", icon: GraduationCap },
  { to: "/admin/issue", label: "Issue", icon: LayoutDashboard },
  { to: "/admin/login", label: "Admin Login", icon: LogIn }
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
      : "bg-white/70 text-slate-600 hover:bg-white hover:text-primary-700"
  }`;

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-radial-grid px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute left-[-12rem] top-[-12rem] h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-[20%] h-80 w-80 rounded-full bg-indigo-300/35 blur-3xl" />

      <header className="relative z-10 mx-auto mb-8 flex w-full max-w-6xl flex-col gap-4 rounded-2xl border border-white/70 bg-white/65 p-4 shadow-glass backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">CertLedger Nexus</p>
          <h1 className="text-lg font-bold text-slate-900">Blockchain Certificate Intelligence</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            if (!isAuthenticated && item.to === "/admin/issue") {
              return null;
            }

            if (isAuthenticated && item.to === "/admin/login") {
              return null;
            }

            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<VerifyPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/issue" element={<AdminIssuePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
