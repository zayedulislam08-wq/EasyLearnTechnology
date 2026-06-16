import { doc, getDoc, setDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

const ADMIN_EMAIL = 'zayedulislam08@gmail.com';

/**
 * Initializes the admin account in the users collection.
 */
export const seedAdminAccount = async (adminUid: string) => {
  try {
    const adminRef = doc(db, 'users', adminUid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        email: ADMIN_EMAIL,
        name: 'System Admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      console.log('Admin account seeded successfully.');
    }
  } catch (error) {
    console.error('Failed to seed admin account:', error);
  }
};

/**
 * Seeds initial courses if the courses collection is empty.
 */
export const seedCourses = async (adminUid: string) => {
  try {
    const q = query(collection(db, 'courses'), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('Seeding courses...');
      const coursesToSeed = [
        {
          id: 'course-1',
          title: 'Website Development',
          description: 'A comprehensive guide to building responsive and interactive websites from scratch. Covers HTML, CSS, JavaScript, and modern frameworks.',
          category: 'Website',
          instructorId: adminUid,
          instructorName: 'System Admin',
          price: 99.99,
          studentsCount: 0,
          thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
          status: 'published'
        },
        {
          id: 'course-2',
          title: 'Graphic Design',
          description: 'Master the principles of graphic design, typography, and color theory. Learn to use industry-standard tools like Adobe Creative Suite.',
          category: 'Design',
          instructorId: adminUid,
          instructorName: 'System Admin',
          price: 89.99,
          studentsCount: 0,
          thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
          status: 'published'
        },
        {
          id: 'course-3',
          title: 'Digital Marketing',
          description: 'Learn the strategies to grow your online presence. SEO, social media marketing, email campaigns, and analytics.',
          category: 'Marketing',
          instructorId: adminUid,
          instructorName: 'System Admin',
          price: 79.99,
          studentsCount: 0,
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
          status: 'published'
        }
      ];

      for (const course of coursesToSeed) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
      console.log('Courses seeded successfully.');
    }
  } catch (error) {
    console.error('Failed to seed courses:', error);
  }
};
