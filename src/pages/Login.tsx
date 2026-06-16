import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Role } from '../types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e?: React.FormEvent, forceRole?: Role) => {
    e?.preventDefault();
    
    // Auto-detect role based on email for demo, or use forced role
    let role: Role = forceRole || 'student';
    if (!forceRole) {
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('instructor')) role = 'instructor';
    }

    const targetEmail = forceRole ? `${forceRole}@edulms.com` : email || `${role}@edulms.com`;

    login(targetEmail, role);

    // Redirect based on role
    if (role === 'admin') navigate('/admin');
    else if (role === 'instructor') navigate('/instructor');
    else navigate('/student');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full mix-blend-multiply opacity-20 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-300 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-300 rounded-full blur-[120px] mix-blend-multiply" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 p-8 sm:p-10 border border-white relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-indigo-600/30">
            E
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-500">Demo Access</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleLogin(undefined, 'admin')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 transition-colors group"
            >
              <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">Admin</span>
            </button>
            <button
              onClick={() => handleLogin(undefined, 'instructor')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 text-purple-700 transition-colors group"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">Instructor</span>
            </button>
            <button
              onClick={() => handleLogin(undefined, 'student')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition-colors group"
            >
              <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">Student</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
