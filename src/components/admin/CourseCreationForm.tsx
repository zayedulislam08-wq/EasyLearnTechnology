import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Save, Upload, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, FileBox, X, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import Editor from 'react-simple-wysiwyg';

interface Lesson {
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
}

interface Module {
  title: string;
  description: string;
  isExpanded: boolean;
  lessons: Lesson[];
}

interface CourseCreationFormProps {
  onCancel: () => void;
  onSave: (courseData: any) => void;
}

const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  type: z.enum(['video', 'article', 'quiz']),
  duration: z.string().optional()
});

const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  description: z.string().optional(),
  isExpanded: z.boolean(),
  lessons: z.array(lessonSchema)
});

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').refine(val => {
    // Strip HTML tags for length check, since quill wraps in <p>
    const text = val.replace(/<[^>]*>?/gm, '').trim();
    return text.length >= 10;
  }, 'Description must contain at least 10 characters of text'),
  price: z.coerce.number().positive('Price must be greater than 0').or(z.literal('')), // allow empty initially, caught later
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['draft', 'published', 'archived']),
  learningObjectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()),
  curriculum: z.array(moduleSchema).min(1, 'At least one module is required'),
});

type CourseStatus = 'draft' | 'published' | 'archived';

export default function CourseCreationForm({ onCancel, onSave }: CourseCreationFormProps) {
  const defaultFormState = {
    title: '',
    description: '',
    price: '',
    category: '',
    status: 'draft' as CourseStatus,
    learningObjectives: [''],
    prerequisites: [''],
    curriculum: [{ 
      title: '', 
      description: '', 
      isExpanded: true,
      lessons: [{ title: '', type: 'video' as const, duration: '' }] 
    }] as Module[],
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedDraft = localStorage.getItem('course_draft_form');
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem('course_draft_form', JSON.stringify(formData));
    setSaveMessage('Draft saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const validateForm = () => {
    try {
      courseSchema.parse({
        ...formData,
        price: formData.price === '' ? 0 : Number(formData.price) // validate real price
      });
      // also check if price is valid number manually since coerce makes 0 from ''
      if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        setErrors({ price: 'Price must be greater than 0' });
        return false;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (error as any).errors.forEach((err: any) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      localStorage.removeItem('course_draft_form');
    } else {
        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleArrayChange = (field: 'learningObjectives' | 'prerequisites', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'learningObjectives' | 'prerequisites') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'learningObjectives' | 'prerequisites', index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleCurriculumChange = (index: number, field: keyof Module, value: any) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index] = { ...newCurriculum[index], [field]: value };
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const toggleModuleExpansion = (index: number) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index].isExpanded = !newCurriculum[index].isExpanded;
    setFormData({ ...formData, curriculum: newCurriculum });
  }

  const addCurriculumItem = () => {
    setFormData({ 
      ...formData, 
      curriculum: [
        ...formData.curriculum, 
        { title: '', description: '', isExpanded: true, lessons: [] }
      ] 
    });
  };

  const removeCurriculumItem = (index: number) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum.splice(index, 1);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: string) => {
    const newCurriculum = [...formData.curriculum];
    const newLessons = [...newCurriculum[moduleIndex].lessons];
    newLessons[lessonIndex] = { ...newLessons[lessonIndex], [field]: value };
    newCurriculum[moduleIndex].lessons = newLessons;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const addLessonItem = (moduleIndex: number) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].lessons.push({ title: '', type: 'video', duration: '' });
    newCurriculum[moduleIndex].isExpanded = true;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const removeLessonItem = (moduleIndex: number, lessonIndex: number) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].lessons.splice(lessonIndex, 1);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const renderStudentPreview = () => (
    <AnimatePresence>
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-50 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" /> Wait, Here's How Students Will See It
              </h3>
              <button onClick={() => setShowPreview(false)} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <h1 className="text-3xl font-bold text-slate-900">{formData.title || 'Untitled Course'}</h1>
                  <div className="text-slate-600 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: formData.description || '<p>No description provided.</p>' }} />
                  
                  {formData.learningObjectives.length > 0 && formData.learningObjectives[0] !== '' && (
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">What you'll learn</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.learningObjectives.filter(o => o.trim() !== '').map((obj, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span className="text-sm text-slate-700">{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Course Content</h3>
                    <div className="space-y-3">
                      {formData.curriculum.map((mod, i) => (
                        <div key={i} className="border border-slate-200 bg-white rounded-xl overflow-hidden">
                          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800 flex justify-between">
                            <span>Module {i + 1}: {mod.title || 'Untitled Module'}</span>
                            <span className="text-sm font-normal text-slate-500">{mod.lessons.length} lessons</span>
                          </div>
                          <div className="divide-y divide-slate-100">
                            {mod.lessons.map((les, j) => (
                              <div key={j} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                  {les.type === 'video' ? <PlayCircle className="w-5 h-5 text-indigo-500" /> : <FileText className="w-5 h-5 text-purple-500" />}
                                  <span className="text-sm font-medium text-slate-700">{les.title || 'Untitled Lesson'}</span>
                                </div>
                                <span className="text-xs text-slate-500">{les.duration || 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="sticky top-6 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
                    <div className="aspect-video bg-slate-100 rounded-xl mb-6 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-slate-300" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-6">${formData.price || '0.00'}</div>
                    <button className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl mb-3 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700">
                      Enroll Now
                    </button>
                    <p className="text-xs text-center text-slate-500 mb-6">30-Day Money-Back Guarantee</p>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Category</span> <span className="font-medium text-slate-900 capitalize">{formData.category || 'N/A'}</span></div>
                      <div className="flex justify-between"><span>Access</span> <span className="font-medium text-slate-900">Lifetime full access</span></div>
                      <div className="flex justify-between"><span>Certificate</span> <span className="font-medium text-slate-900">Yes</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {renderStudentPreview()}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Create New Course</h2>
              <p className="text-sm text-slate-500">Fill in the details to publish a new course</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {saveMessage && <span className="text-sm text-emerald-600 font-medium animate-pulse">{saveMessage}</span>}
            
            <button 
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button 
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileBox className="w-4 h-4" />
              Save as Draft
            </button>

            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Course
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                 <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                 
                 {/* Status Toggle */}
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['draft', 'published', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFormData({...formData, status: status as CourseStatus})}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                          formData.status === status 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced React Patterns"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.title ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <div className={`rounded-xl overflow-hidden ${errors.description ? 'border border-red-300 ring-1 ring-red-300' : 'border border-slate-200'}`}>
                    <Editor 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white min-h-[150px] border-none"
                    />
                  </div>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="99.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.price ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all ${errors.category ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                    >
                      <option value="">Select Category</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Curriculum */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Curriculum Structure</h3>
                {errors.curriculum && <p className="text-red-500 text-xs">{errors.curriculum}</p>}
              </div>
              
              <div className="space-y-4">
                {formData.curriculum.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
                    {/* Module Header */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200 relative flex items-start gap-3">
                      <button className="mt-1 text-slate-400 cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-3 pr-8">
                           <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Module {moduleIndex + 1}</label>
                            <input
                              type="text"
                              placeholder="Module Title (e.g. Introduction to React)"
                              value={module.title}
                              onChange={(e) => handleCurriculumChange(moduleIndex, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <textarea
                            rows={2}
                            placeholder="What will learners accomplish in this module?"
                            value={module.description}
                            onChange={(e) => handleCurriculumChange(moduleIndex, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none"
                          />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <button 
                          onClick={() => removeCurriculumItem(moduleIndex)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleModuleExpansion(moduleIndex)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          {module.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    <AnimatePresence>
                      {module.isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-white"
                        >
                          <div className="space-y-3 mb-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm group/lesson transition-colors hover:border-slate-300">
                                 <button className="text-slate-300 hover:text-slate-500 cursor-move transition-colors hidden sm:block">
                                  <GripVertical className="w-4 h-4" />
                                </button>
                                
                                <select
                                  value={lesson.type}
                                  onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'type', e.target.value)}
                                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                                >
                                  <option value="video">🎥 Video</option>
                                  <option value="article">📄 Article</option>
                                  <option value="quiz">📝 Quiz</option>
                                </select>

                                <input
                                  type="text"
                                  placeholder="Lesson Title"
                                  value={lesson.title}
                                  onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)}
                                  className="flex-1 min-w-[120px] px-3 py-1.5 bg-transparent text-sm focus:outline-none border border-transparent focus:border-slate-200 rounded-md transition-colors"
                                />

                                 <input
                                  type="text"
                                  placeholder="10m"
                                  value={lesson.duration}
                                  onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                  className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-center focus:ring-1 focus:ring-indigo-600 outline-none placeholder:text-slate-400"
                                />

                                <button 
                                  onClick={() => removeLessonItem(moduleIndex, lessonIndex)}
                                  className="p-1.5 text-slate-300 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors sm:opacity-0 group-hover/lesson:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button 
                            onClick={() => addLessonItem(moduleIndex)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Content
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                
                <button 
                  onClick={addCurriculumItem}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all w-full justify-center"
                >
                  <Plus className="w-5 h-5" />
                  Add New Module
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Media */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Media</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Thumbnail</label>
                <div className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-100 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                  <p className="text-xs text-slate-500 mt-1">1920x1080 recommended</p>
                </div>
              </div>
            </section>

            {/* Learning Objectives */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Learning Objectives</h3>
              <div className="space-y-3">
                {formData.learningObjectives.map((obj, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Build real-world applications"
                      value={obj}
                      onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    />
                    <button 
                      onClick={() => removeArrayItem('learningObjectives', index)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('learningObjectives')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Objective
                </button>
                {errors.learningObjectives && <p className="text-red-500 text-xs mt-1">{errors.learningObjectives}</p>}
              </div>
            </section>

            {/* Prerequisites */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Prerequisites</h3>
              <div className="space-y-3">
                {formData.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Basic understanding of HTML/CSS"
                      value={prereq}
                      onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    />
                    <button 
                      onClick={() => removeArrayItem('prerequisites', index)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('prerequisites')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Prerequisite
                </button>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </>
  );
}
