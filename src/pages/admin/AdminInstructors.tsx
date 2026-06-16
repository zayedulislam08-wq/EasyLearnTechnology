import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Loader2 } from 'lucide-react';
import { InstructorAPI, InstructorAnalytics } from '../../services/api';

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState<InstructorAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    InstructorAPI.getInstructors().then(res => {
      setInstructors(res);
      setLoading(false);
    });
  }, []);

  const handlePayout = async (id: number) => {
    setProcessingId(id);
    try {
      await InstructorAPI.processPayout(id);
      setInstructors(instructors.map(inst => inst.id === id ? { ...inst, pendingPayout: 0 } : inst));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search instructors..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Instructor</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Total Sales</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Commission Rate</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Pending Payout</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instructors.map((instructor, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={instructor.id} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {instructor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{instructor.name}</p>
                        <p className="text-xs text-slate-500">{instructor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">${instructor.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{instructor.commissionRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      instructor.pendingPayout > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      ${instructor.pendingPayout.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handlePayout(instructor.id)}
                      disabled={instructor.pendingPayout === 0 || processingId === instructor.id}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center min-w-[120px] ml-auto ${
                        instructor.pendingPayout > 0 
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200' 
                        : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      {processingId === instructor.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Process Payout'
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
