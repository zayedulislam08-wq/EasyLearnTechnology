export type Role = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  price: number;
  studentsCount: number;
  thumbnail: string;
  status: 'published' | 'draft';
}

export interface DigitalService {
  id: string;
  name: string;
  description: string;
  price: number;
  salesCount: number;
}
