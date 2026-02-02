import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { mockUser } from '../data/mockData';
import { User, LogOut, Settings, Loader2, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface DashboardLayoutProps {
  mode?: 'main' | 'instance';
}

export default function DashboardLayout({ mode = 'main' }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Click Outside Handler
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && userMenuOpen) {
          setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // In instance mode, sidebar is locked to 16 (4rem), otherwise respects state
  const sidebarWidth = mode === 'instance' ? 'ml-16' : (sidebarCollapsed ? 'ml-16' : 'ml-64');

  const handleSignOut = () => {
    setUserMenuOpen(false);
    setIsSigningOut(true);
    setTimeout(() => {
        setIsSigningOut(false);
        navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Sign Out Overlay */}
      <AnimatePresence>
        {isSigningOut && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-100 animate-spin" />
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">Logging out...</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <Sidebar
        mode={mode}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
        `}
      >
        {/* Top Header */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300">
          <div className="h-full px-6 flex items-center justify-between">
            {/* V4 Global Breadcrumbs */}
            <Breadcrumbs />

            <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    id="user-menu-button"
                >
                    <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                </button>

                <AnimatePresence>
                    {userMenuOpen && (
                    <>
                        <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 py-2 z-50 overflow-hidden"
                        >
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {mockUser.name}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{mockUser.email}</p>
                        </div>
                        
                        <div className="py-1">
                            <button
                            onClick={() => {
                                setUserMenuOpen(false);
                                navigate('/app/settings');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5"
                            >
                            <User className="w-4 h-4" />
                            Profile
                            </button>
                            <button
                            onClick={() => {
                                setUserMenuOpen(false);
                                navigate('/app/settings');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5"
                            >
                            <Settings className="w-4 h-4" />
                            Settings
                            </button>
                        </div>

                        <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                            <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5"
                            >
                            <LogOut className="w-4 h-4" />
                            Sign out
                            </button>
                        </div>
                        </motion.div>
                    </>
                    )}
                </AnimatePresence>
                </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
