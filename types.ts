
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  isApproved: boolean;
  enrolledCourses: string[];
  teachingSubjects: string[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  classLevel: string;
  teacherId: string;
  description: string;
  thumbnail: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'PPT' | 'IMAGE' | 'ZIP';
  subjectId: string;
  uploadedBy: string;
  downloads: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  subjectId?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  authorId: string;
  category: string;
  createdAt: string;
  tags: string[];
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  footerText: string;
  isRegistrationEnabled: boolean;
}
