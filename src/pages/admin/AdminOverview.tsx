import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, DollarSign, Package, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AnalyticsAPI } from '../../services/api';

const data = [
  { name: 'Jan', revenue: 4000, students: 240 },
  { name: 'Feb', revenue: 3000, students: 139 },
  { name: 'Mar', revenue: 2000, students: 980 },
  { name: 'Apr', revenue: 2780, students: 390 },
  { name: 'May', revenue: 1890, students: 480 },
  { name: 'Jun', revenue: 2390, students: 380 },
  { name: 'Jul', revenue: 3490, students: 430 },
];

const enrollmentData = [
  { week: 'W1', enrollments: 45 },
  { week: 'W2', enrollments: 52 },
  { week: 'W3', enrollments: 38 },
  { week: 'W4', enrollments: 65 },
  { week: 'W5', enrollments: 48 },
  { week: 'W6', enrollments: 70 },
  { week: 'W7', enrollments: 85 },
  { week: 'W8', enrollments: 62 },
  { week: 'W9', enrollments: 90 },
  { week: 'W10', enrollments: 110 },
  { week: 'W11', enrollments: 95 },
  { week: 'W12', enrollments: 125 },
];

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsAPI.getOverview().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const userStatsIcons = [DollarSign, Users, BookOpen, Package];
  const userStatsColors = [
    { color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { color: 'text-purple-600', bg: 'bg-purple-50' },
    { color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  const stats = data.stats.map((stat: any, i: number) => ({
    ...stat,
    icon: userStatsIcons[i % userStatsIcons.length],
    ...userStatsColors[i % userStatsColors.length]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="5 5" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Enrollments (Last 3 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="5 5" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="enrollments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Enrollments</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=user${i}`} alt="user" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">User {i}</p>
                    <p className="text-xs text-slate-500">Advanced React Patterns</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-emerald-600">+$99.00</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Performing Courses</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Course Name {i}</p>
                    <p className="text-xs text-slate-500">{i * 120} Students</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-900">${i * 1200}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
