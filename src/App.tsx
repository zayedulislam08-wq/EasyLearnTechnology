import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Views
import AdminOverview from './pages/admin/AdminOverview';
import AdminCourses from './pages/admin/AdminCourses';
import AdminInstructors from './pages/admin/AdminInstructors';

// Instructor Views
import InstructorOverview from './pages/instructor/InstructorOverview';
import InstructorCourses from './pages/instructor/InstructorCourses';

// Student Views
import StudentOverview from './pages/student/StudentOverview';

// Icons
import { LayoutDashboard, BookOpen, Users, Package, Settings, GraduationCap } from 'lucide-react';

// Require Auth wrapper
function RequireAuth({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Admin Links
const adminLinks = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Instructors', href: '/admin/instructors', icon: Users },
  { label: 'Students', href: '/admin/students', icon: GraduationCap },
  { label: 'Digital Services', href: '/admin/services', icon: Package },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const instructorLinks = [
  { label: 'Overview', href: '/instructor', icon: LayoutDashboard },
  { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
  { label: 'My Students', href: '/instructor/students', icon: Users },
  { label: 'Settings', href: '/instructor/settings', icon: Settings },
];

const studentLinks = [
  { label: 'My Learning', href: '/student', icon: LayoutDashboard },
  { label: 'Exams', href: '/student/exams', icon: BookOpen },
  { label: 'Settings', href: '/student/settings', icon: Settings },
];

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/admin" element={
          <RequireAuth allowedRoles={['admin']}>
            <DashboardLayout links={adminLinks} title="Admin" />
          </RequireAuth>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="instructors" element={<AdminInstructors />} />
          <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon...</div>} />
        </Route>

        <Route path="/instructor" element={
          <RequireAuth allowedRoles={['instructor']}>
            <DashboardLayout links={instructorLinks} title="Instructor" />
          </RequireAuth>
        }>
          <Route index element={<InstructorOverview />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon...</div>} />
        </Route>

        <Route path="/student" element={
          <RequireAuth allowedRoles={['student']}>
            <DashboardLayout links={studentLinks} title="Student" />
          </RequireAuth>
        }>
          <Route index element={<StudentOverview />} />
          <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon...</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
