import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user?.role === 'admin') navigate('/admin');
    else if (user?.role === 'instructor') navigate('/instructor');
    else if (user?.role === 'student') navigate('/student');
    else navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">
                E
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                EduLMS
              </span>
            </Link>

            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Courses</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Digital Services</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">About</a>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={handleDashboardClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-sm hover:shadow-indigo-500/25 shadow-none"
                >
                  <BookOpen className="w-4 h-4" />
                  My Dashboard
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} EduLMS Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
