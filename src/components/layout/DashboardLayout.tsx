import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarLink {
  icon: React.FC<{ className?: string }>;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  links: SidebarLink[];
  title: string;
}

export default function DashboardLayout({ links, title }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
          E
        </div>
        <span className="text-xl font-bold text-slate-800">EduLMS</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href.split('/').length <= 2}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex relative h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-[-40px] text-white p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/80"
              >
                <X className="w-5 h-5" />
              </button>
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-800">EduLMS</span>
          </div>

          <div className="hidden lg:flex items-center text-xl font-bold text-slate-800">
            {title} Dashboard
          </div>

          <div className="flex items-center gap-4">
             <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Front Page
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
