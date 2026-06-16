import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, LayoutDashboard, MonitorPlay, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-100 rounded-full blur-[100px] opacity-60 translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-100 rounded-full blur-[100px] opacity-60 -translate-x-1/2 translate-y-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            The Next-Generation LMS Platform
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 max-w-4xl mx-auto"
          >
            Empower your learning <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ecosystem today
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          >
            A powerful, all-in-one platform for admins, forward-thinking instructors, and ambitious students. Create courses, sell digital services, and manage everything in one seamless experience.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/login"
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Roles tailored for success</h2>
            <p className="text-slate-600">Smart dashboards automatically route you to the tools you need.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Admin CRM & CMS</h3>
              <p className="text-slate-600">Complete control over courses, memberships, physical sales, and user roles. A command center for everything.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-purple-50/50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instructor Tools</h3>
              <p className="text-slate-600">Create rich courses, manage student progress, grade exams, and curate access effortlessly.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <MonitorPlay className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Student Portal</h3>
              <p className="text-slate-600">A distraction-free environment to consume content, track progress, participate in exams, and download assets.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
