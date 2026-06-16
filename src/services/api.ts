import { Course } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AnalyticsAPI = {
  getOverview: async () => {
    await delay(800);
    return {
      stats: [
        { title: 'Total Revenue', value: '$45,231.89', change: '+12.5%' },
        { title: 'Active Students', value: '2,405', change: '+18.2%' },
        { title: 'Active Courses', value: '45', change: '+4.3%' },
        { title: 'Completion Rate', value: '68%', change: '+2.1%' }
      ],
      revenueData: [
        { name: 'Jan', revenue: 4000, students: 240 },
        { name: 'Feb', revenue: 3000, students: 139 },
        { name: 'Mar', revenue: 2000, students: 980 },
        { name: 'Apr', revenue: 2780, students: 390 },
        { name: 'May', revenue: 1890, students: 480 },
        { name: 'Jun', revenue: 2390, students: 380 },
        { name: 'Jul', revenue: 3490, students: 430 },
      ],
      enrollmentData: [
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
      ]
    };
  }
};

export interface InstructorAnalytics {
  id: number;
  name: string;
  email: string;
  sales: number;
  commissionRate: number;
  pendingPayout: number;
  status: string;
}

export const InstructorAPI = {
  getInstructors: async (): Promise<InstructorAnalytics[]> => {
    await delay(1000);
    const mockDb = [
      { id: 1, name: 'Sarah Drasner', email: 'sarah@example.com', sales: 45000, commissionRate: 70, status: 'active' },
      { id: 2, name: 'Brad Traversy', email: 'brad@example.com', sales: 82000, commissionRate: 80, status: 'active' },
      { id: 3, name: 'Gary Simon', email: 'gary@example.com', sales: 12000, commissionRate: 60, status: 'active' },
      { id: 4, name: 'Kirill Eremenko', email: 'kirill@example.com', sales: 156000, commissionRate: 85, status: 'active' },
    ];
    // Calculate pending payout (mock logic)
    return mockDb.map(inst => ({
      ...inst,
      pendingPayout: (inst.sales * (inst.commissionRate / 100)) * 0.1 // Let's pretend 10% is unpaid
    }));
  },
  processPayout: async (instructorId: number): Promise<{ success: boolean; message: string }> => {
    await delay(1200);
    return { success: true, message: `Payout successfully processed for instructor ID: ${instructorId}` };
  }
};

export const InstructorDashboardAPI = {
  getOverview: async (instructorId: string) => {
    await delay(800);
    // Mock scoped data
    return {
      stats: [
        { title: 'My Courses', value: '12', change: '+2' },
        { title: 'Total Students', value: '4,850', change: '+120' },
        { title: 'Average Rating', value: '4.8', change: '+0.1' },
        { title: 'Monthly Revenue', value: '$8,240', change: '+15%' },
      ],
      performanceData: [
        { name: 'Mon', views: 400, enrollments: 24 },
        { name: 'Tue', views: 300, enrollments: 13 },
        { name: 'Wed', views: 550, enrollments: 38 },
        { name: 'Thu', views: 278, enrollments: 19 },
        { name: 'Fri', views: 689, enrollments: 48 },
        { name: 'Sat', views: 839, enrollments: 68 },
        { name: 'Sun', views: 749, enrollments: 53 },
      ]
    };
  },
  getQAs: async (instructorId: string) => {
    await delay(500);
    return [
      { id: 'qa-1', studentName: 'David Johnson', time: '2h ago', question: 'I\'m having trouble understanding the concept of React Hooks in lecture 14...', reply: '' },
      { id: 'qa-2', studentName: 'Emily Chen', time: '5h ago', question: 'Is the final project required to get the certificate? Also, can we use Vue instead of React?', reply: 'Yes, the project is required. For this specific course, we require using React to evaluate your understanding.' },
      { id: 'qa-3', studentName: 'Michael Brown', time: '1d ago', question: 'Can you provide the source code for the previous module?', reply: '' },
    ];
  },
  replyQA: async (qaId: string, reply: string) => {
    await delay(600);
    return { success: true };
  }
};

const MOCK_COURSES: Course[] = [
  { id: '1', title: 'Advanced React Patterns', description: 'Master React...', instructorId: 'inst-1', instructorName: 'Sarah Drasner', price: 99, studentsCount: 1200, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', status: 'published' },
  { id: '2', title: 'UI/UX Design Masterclass', description: 'Learn design...', instructorId: 'inst-1', instructorName: 'Sarah Drasner', price: 149, studentsCount: 850, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', status: 'published' },
  { id: '3', title: 'Node.js Backend Architecture', description: 'Build scalable...', instructorId: 'inst-2', instructorName: 'Brad Traversy', price: 89, studentsCount: 2000, thumbnail: 'https://images.unsplash.com/photo-1627398225058-612f4306b9b2?w=800&q=80', status: 'published' },
];

export const CourseAPI = {
  getCourses: async (instructorId?: string): Promise<Course[]> => {
    await delay(800);
    if (instructorId) {
      return MOCK_COURSES.filter(c => c.instructorId === instructorId);
    }
    return MOCK_COURSES;
  },
  createCourse: async (courseData: any): Promise<{ success: boolean; course: Course }> => {
    await delay(1500); // Simulate network latency and processing
    
    // Server-side shape mapping mock
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      status: courseData.status || 'draft',
      instructorId: courseData.instructorId || 'admin',
      instructorName: courseData.instructorName || 'Admin',
      studentsCount: 0,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
    };

    return { success: true, course: newCourse };
  }
};
