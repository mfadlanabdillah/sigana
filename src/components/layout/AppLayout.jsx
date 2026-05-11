import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  FileText,
  Building2,
  Heart,
  BarChart3,
  FolderOpen,
  PenTool,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { useDisasterNotifications } from '../../hooks/useDisasterNotifications';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/peta', icon: Map, label: 'Peta Bencana' },
  { path: '/laporan', icon: AlertTriangle, label: 'Laporan' },
  { path: '/peringatan-dini', icon: Bell, label: 'Peringatan Dini' },
  { path: '/infografis', icon: BarChart3, label: 'Infografis' },
  { path: '/evakuasi', icon: Building2, label: 'Posko Evakuasi' },
  { path: '/bantuan', icon: Heart, label: 'Data Bantuan' },
  { path: '/analisis', icon: BarChart3, label: 'Analisis' },
  { path: '/dokumen', icon: FolderOpen, label: 'Dokumen' },
  { path: '/buat-laporan', icon: PenTool, label: 'Buat Laporan' },
  { path: '/rekomendasi', icon: Lightbulb, label: 'Rekomendasi' },
];

export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { darkMode, toggleDark } = useTheme();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground z-40 transition-all duration-200 ease-in-out flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">SiGANA</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="w-full flex justify-center">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={toggleDark}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}

export function Topbar({ onMenuClick, title }) {
  const { activeDisasters } = useDisasterNotifications();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-sm bg-card/80">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-heading font-semibold text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5" />
          {activeDisasters.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center text-white">
              {activeDisasters.length}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children, title }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const pageTitle = title || navItems.find(item => item.path === location.pathname)?.label || 'SiGANA';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <Topbar title={pageTitle} />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-sidebar">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-sidebar-accent rounded-lg"
                >
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>
              <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
