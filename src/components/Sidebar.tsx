import { NavLink, useParams, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  MessageSquare,
  ChevronLeft,
  Zap,
  CreditCard,
  Sparkles,
  Blocks,
} from "lucide-react";

interface SidebarProps {
  mode: "main" | "instance";
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ mode, collapsed, onToggle }: SidebarProps) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Mode A: Main Sidebar Links
  const mainNavItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/app/dashboard",
    },
    {
      name: "Files",
      icon: Database,
      path: "/app/files",
    },
    {
      name: "Insights",
      icon: Sparkles,
      path: "/app/insights",
    },
    {
       name: "Integration",
       icon: Blocks,
       path: "/app/integration",
    },
    {
      name: "Billings",
      icon: CreditCard,
      path: "/app/billings",
    },
  ];

  // Mode B: Instant Sidebar Links
  const instantNavItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: `/app/instant/${id}/dashboard`,
    },
    {
      name: "Chat Interface",
      icon: MessageSquare,
      path: `/app/instant/${id}/chat`,
    },
  ];

  // Determine which links to show
  const navItems = mode === "main" ? mainNavItems : instantNavItems;

  // In Instance mode, sidebar is always collapsed (locked)
  const isLockedCollapsed = mode === "instance";
  const effectiveCollapsed = isLockedCollapsed ? true : collapsed;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
        flex flex-col z-50 transition-all duration-300 ease-in-out
        ${effectiveCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header / Logo */}
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-between shrink-0">
        <NavLink
          to="/app/dashboard"
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-8 h-8 bg-zinc-900 dark:bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          {!effectiveCollapsed && (
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight whitespace-nowrap">
              Ven AI
            </span>
          )}
        </NavLink>

        {/* Toggle Button (Only in Main Mode) */}
        {!isLockedCollapsed && !effectiveCollapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }
                  ${effectiveCollapsed ? "justify-center" : ""}
                `}
              >
                <item.icon
                  className={`
                  w-5 h-5 flex-shrink-0 transition-colors
                  ${location.pathname === item.path ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}
                `}
                />

                {!effectiveCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {effectiveCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {item.name}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Expand Button for Main Mode when collapsed */}
        {!isLockedCollapsed && effectiveCollapsed && (
          <button
            onClick={onToggle}
            className="mt-4 w-full flex justify-center p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        )}
      </nav>

      {/* Footer */}
      {!effectiveCollapsed && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">US</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                Ven AI User
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
