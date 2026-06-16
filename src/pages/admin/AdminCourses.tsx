import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Filter, MoreVertical, UploadCloud, Loader2 } from 'lucide-react';
import { Course } from '../../types';
import CourseCreationForm from '../../components/admin/CourseCreationForm';
import { CourseAPI } from '../../services/api';

const mockCourses: Course[] = [
  { id: '1', title: 'Advanced React Patterns', description: 'Master React...', instructorId: 'i1', instructorName: 'Sarah Drasner', price: 99, studentsCount: 1200, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', status: 'published' },
  { id: '2', title: 'Complete Node.js Bootcamp', description: 'Backend...', instructorId: 'i2', instructorName: 'Brad Traversy', price: 149, studentsCount: 850, thumbnail: 'https://images.unsplash.com/photo-1627398225058-612f4306b9b2?w=800&q=80', status: 'published' },
  { id: '3', title: 'UI/UX Design for absolute beginners', description: 'Design...', instructorId: 'i3', instructorName: 'Gary Simon', price: 79, studentsCount: 2100, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', status: 'published' },
  { id: '4', title: 'Machine Learning A-Z', description: 'AI...', instructorId: 'i4', instructorName: 'Kirill Eremenko', price: 199, studentsCount: 3200, thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80', status: 'draft' },
];

export default function AdminCourses() {
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveCourse = async (data: any) => {
    setIsSaving(true);
    try {
      const result = await CourseAPI.createCourse(data);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadError('Invalid file format. Please upload a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim().length > 0);
      if (rows.length < 2) {
        setUploadError('CSV file is empty or missing data.');
        return;
      }

      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['title', 'price', 'category'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setUploadError(`Missing required CSV columns: ${missingHeaders.join(', ')}`);
        return;
      }

      const titleIdx = headers.indexOf('title');
      const priceIdx = headers.indexOf('price');

      const newCourses: Course[] = rows.slice(1).map((row, i) => {
        const columns = row.split(',').map(c => c.trim());
        const price = parseFloat(columns[priceIdx] || '0');
        
        return {
          id: `csv-${Date.now()}-${i}`,
          title: columns[titleIdx] || 'Untitled Course',
          description: 'Imported from CSV',
          instructorId: 'admin',
          instructorName: 'Admin',
          price: isNaN(price) ? 0 : price,
          studentsCount: 0,
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
          status: 'draft'
        };
      });

      setCourses([...newCourses, ...courses]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          
          <div className="relative">
            <input 
              type="file" 
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors text-indigo-700"
            >
              <UploadCloud className="w-4 h-4" />
              Bulk Upload CSV
            </button>
          </div>

          <button 
            onClick={() => setIsCreatingCourse(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </div>
      </div>

      <AnimatePresence>
        {uploadError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium"
          >
            {uploadError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Course</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Instructor</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Price</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Students</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={course.id} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{course.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{course.instructorName}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">${course.price}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{course.studentsCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      course.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical className="w-5 h-5" />
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
