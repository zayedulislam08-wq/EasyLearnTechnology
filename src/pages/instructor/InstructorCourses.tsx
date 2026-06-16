import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Course } from '../../types';
import CourseCreationForm from '../../components/admin/CourseCreationForm';
import { CourseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function InstructorCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      CourseAPI.getCourses(user.id).then(data => {
        setCourses(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSaveCourse = async (data: any) => {
    setIsSaving(true);
    try {
      const result = await CourseAPI.createCourse({
        ...data,
        instructorId: user?.id,
        instructorName: user?.name,
      });
      if (result.success) {
        setCourses([result.course, ...courses]);
        setIsCreatingCourse(false);
      }
    } catch (err) {
      console.error("Failed to save course", err);
      alert("Failed to save course. Check validation.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isCreatingCourse) {
    return (
      <div className="relative">
        {isSaving && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="font-medium text-slate-800">Saving course...</span>
            </div>
          </div>
        )}
        <CourseCreationForm onCancel={() => setIsCreatingCourse(false)} onSave={handleSaveCourse} />
      </div>
    );
  }

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search my courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          />
        </div>
        
        <button 
          onClick={() => setIsCreatingCourse(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={course.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="aspect-video relative overflow-hidden bg-slate-100">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                  course.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                  course.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-lg font-bold text-slate-900">
                  ${course.price.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {course.studentsCount.toLocaleString()} Students
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <h3 className="text-lg font-medium text-slate-900 mb-1">No courses found</h3>
            <p className="text-slate-500">You haven't created any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
