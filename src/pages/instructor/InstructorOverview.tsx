import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BookOpen, Star, TrendingUp, Edit3, Loader2, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { InstructorDashboardAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function InstructorOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [qas, setQas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // QA Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        InstructorDashboardAPI.getOverview(user.id),
        InstructorDashboardAPI.getQAs(user.id)
      ]).then(([overviewData, qaData]) => {
        setData(overviewData);
        setQas(qaData);
        setLoading(false);
      });
    }
  }, [user]);

  const handleReplySubmit = async (qaId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      await InstructorDashboardAPI.replyQA(qaId, replyText);
      setQas(qas.map(qa => qa.id === qaId ? { ...qa, reply: replyText } : qa));
      setReplyingTo(null);
      setReplyText('');
    } catch (e) {
      console.error(e);
      alert('Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const userStatsIcons = [BookOpen, Users, Star, TrendingUp];
  const userStatsColors = [
    { color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { color: 'text-amber-600', bg: 'bg-amber-50' },
    { color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const stats = data.stats.map((stat: any, i: number) => ({
    ...stat,
    icon: userStatsIcons[i % userStatsIcons.length],
    ...userStatsColors[i % userStatsColors.length]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Welcome back, {user?.name}!</h2>
        <button 
          onClick={() => navigate('/instructor/courses')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Manage Courses
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat: any, i: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4"
          >
            <div className={`p-3 rounded-xl w-max ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm xl:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Performance Analytics (This Week)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="5 5" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Q&A</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {qas.map((qa) => (
              <div key={qa.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-slate-900">{qa.studentName}</span>
                  <span className="text-xs text-slate-500">{qa.time}</span>
                </div>
                <p className="text-sm text-slate-700 mb-3">{qa.question}</p>
                
                {qa.reply ? (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-semibold text-indigo-800 mb-1">Your reply:</p>
                    <p className="text-sm text-indigo-900">{qa.reply}</p>
                  </div>
                ) : (
                  <div>
                    {replyingTo === qa.id ? (
                      <div className="mt-3 flex gap-2">
                        <input 
                          type="text" 
                          value={replyText} 
                          onChange={(e) => setReplyText(e.target.value)} 
                          placeholder="Type your reply..." 
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                          onKeyDown={(e) => { if (e.key === 'Enter') handleReplySubmit(qa.id); }}
                        />
                        <button 
                          onClick={() => handleReplySubmit(qa.id)}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                          {isSubmittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setReplyingTo(qa.id); setReplyText(''); }}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-1"
                      >
                        Reply to student
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
