import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, Clock, Trophy, Target, ArrowRight, Search, Frown, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentAPI } from '../../services/api';

export default function StudentOverview() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [hoursLearned, setHoursLearned] = useState(0);
  const [isContinuing, setIsContinuing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      StudentAPI.getOverview(user.id).then(res => {
        setData(res);
        setEnrolledCourses(res.enrolledCourses);
        setHoursLearned(res.baseHoursLearned);
        setLoading(false);
      });
    }
  }, [user]);

  const handleCompleteLesson = async (courseId: string) => {
    if (!user) return;
    setIsContinuing(courseId);
    try {
      const lessonDuration = 30; // mock 30 mins per lesson completion click
      await StudentAPI.markLessonComplete(user.id, courseId, lessonDuration);
      
      setHoursLearned(prev => prev + (lessonDuration / 60)); // Add hours
      
      setEnrolledCourses(courses => 
        courses.map(course => {
          if (course.id === courseId) {
            const newCompletedMins = Math.min(course.completedMins + lessonDuration, course.totalMins);
            const newProgress = Math.round((newCompletedMins / course.totalMins) * 100);
            return {
              ...course,
              completedMins: newCompletedMins,
              progress: newProgress
            };
          }
          return course;
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsContinuing(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const filteredCourses = enrolledCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statIcons = [Target, Clock, Trophy, PlayCircle];
  const statColors = [
    { color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { color: 'text-amber-600', bg: 'bg-amber-50' },
    { color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const displayStats = data.stats.map((stat: any, i: number) => {
    // Override the Hours Learned with our derived state
    let displayValue = stat.value;
    if (stat.title === 'Hours Learned') {
      displayValue = Math.round(hoursLearned).toLocaleString();
    }
    return {
      ...stat,
      value: displayValue,
      icon: statIcons[i % statIcons.length],
      ...statColors[i % statColors.length]
    };
  });

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="relative z-10 w-full sm:w-2/3">
          <h1 className="text-3xl font-bold mb-3">Welcome back, {user?.name}! 🚀</h1>
          <p className="text-indigo-100 mb-6 text-lg">You've learned for {Math.round(hoursLearned)} hours this week. Keep up the great work and finish your certification.</p>
          <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Resume Learning
          </button>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayStats.map((stat: any, i: number) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title} 
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Courses in Progress */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800">My Learning</h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search courses or instructors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              />
            </div>
            
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredCourses.map((course, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={course.id}
                className="group flex flex-col sm:flex-row gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="sm:w-1/3 aspect-video sm:aspect-square rounded-xl overflow-hidden relative shrink-0">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{course.title}</h3>
                  <p className="text-xs font-medium text-indigo-600 mb-2">By {course.instructor}</p>
                  <p className="text-xs text-slate-500 mb-4">{Math.round(course.completedMins / 60)}h {course.completedMins % 60}m / {Math.round(course.totalMins / 60)}h completed</p>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500 mt-2">
                    <span>{course.progress}% Complete</span>
                    {course.progress < 100 ? (
                      <button 
                        onClick={() => handleCompleteLesson(course.id)}
                        disabled={isContinuing === course.id}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {isContinuing === course.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Complete Lesson
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Trophy className="w-4 h-4" /> Done
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-4">
              <Frown className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No matching courses</h3>
            <p className="text-slate-500 text-sm">We couldn't find any courses matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
