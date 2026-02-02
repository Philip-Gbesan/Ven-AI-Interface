import { Outlet, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-zinc-800">
        <div className="h-full px-6 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-50 rounded-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">
              VEN AI
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-zinc-600">
          © 2024 Ven AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
