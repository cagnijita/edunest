
import { UserRole, User, Subject, Post, Note, SiteSettings } from './types';

// Fixed INITIAL_USERS: Added missing properties (enrolledCourses, teachingSubjects, createdAt)
export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    email: 'admin@edubridge.com',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor',
    isApproved: true,
    enrolledCourses: [],
    teachingSubjects: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Prof. Julian Thorne',
    email: 'teacher@edubridge.com',
    role: UserRole.TEACHER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
    bio: 'Specialist in Quantum Computation and Theoretical Physics with over 20 published papers.',
    isApproved: true,
    teachingSubjects: ['Physics', 'Computer Science'],
    enrolledCourses: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Maya Sterling',
    email: 'student@edubridge.com',
    role: UserRole.STUDENT,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    isApproved: true,
    enrolledCourses: ['c1', 'c2', 'c3'],
    teachingSubjects: [],
    createdAt: new Date().toISOString()
  }
];

// Fixed INITIAL_COURSES: Replaced Course with Subject and mapped properties (title -> name, category -> classLevel)
export const INITIAL_COURSES: Subject[] = [
  {
    id: 'c1',
    name: 'Modern Web Architectures',
    description: 'Master the art of building scalable, cloud-native web applications using modern paradigms.',
    teacherId: '2',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    classLevel: 'Computer Science'
  },
  {
    id: 'c2',
    name: 'Advanced Data Science',
    description: 'Exploring machine learning, predictive modeling, and big data analysis techniques.',
    teacherId: '2',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    classLevel: 'Data Science'
  },
  {
    id: 'c3',
    name: 'Digital Marketing Strategy',
    description: 'Learn how to navigate the complex landscape of modern digital advertising and branding.',
    teacherId: '1',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    classLevel: 'Marketing'
  }
];

// Fixed INITIAL_NOTES: Replaced StudyNote with Note and mapped properties
// Added missing description and removed unsupported bookmarkedBy
export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Week 1: Microservices Design',
    description: 'Core concepts of microservices architecture and deployment strategies.',
    subjectId: 'c1',
    uploadedBy: '2',
    fileUrl: '#',
    fileType: 'PDF',
    createdAt: new Date().toISOString(),
    downloads: 128,
  },
  {
    id: 'n2',
    title: 'Regression Analysis Basics',
    description: 'Introductory notes on linear and multiple regression techniques.',
    subjectId: 'c2',
    uploadedBy: '2',
    fileUrl: '#',
    fileType: 'DOCX',
    createdAt: new Date().toISOString(),
    downloads: 42,
  }
];

// Fixed INITIAL_POSTS: Removed unsupported comments property
export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'The AI Revolution in Education',
    content: 'How generative models are creating personalized learning paths for every student on the planet...',
    authorId: '1',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    category: 'Technology',
    tags: ['AI', 'Education', 'Future'],
    createdAt: new Date().toISOString(),
  }
];

// Fixed INITIAL_SETTINGS: Removed showComments/announcementsEnabled and added footerText/isRegistrationEnabled
export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'EduBridge',
  logo: 'EB',
  primaryColor: '#4f46e5',
  footerText: 'EduBridge – Transforming Digital Education.',
  isRegistrationEnabled: true
};
