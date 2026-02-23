
import { User, Subject, Note, Announcement, Post, SiteSettings, UserRole } from './types';

const STORAGE_KEY = 'edunest_db';

interface DB {
  users: User[];
  subjects: Subject[];
  notes: Note[];
  announcements: Announcement[];
  posts: Post[];
  settings: SiteSettings;
}

const INITIAL_DB: DB = {
  users: [
    {
      id: 'u1',
      name: 'Eleanor Vance',
      email: 'admin@edunest.com',
      role: UserRole.ADMIN,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor',
      isApproved: true,
      enrolledCourses: [],
      teachingSubjects: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'u2',
      name: 'Prof. Julian Thorne',
      email: 'teacher@edunest.com',
      role: UserRole.TEACHER,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
      bio: 'Ph.D. in Theoretical Physics. Lead researcher at Quantum Institute.',
      isApproved: true,
      enrolledCourses: [],
      teachingSubjects: ['s1'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'u3',
      name: 'Maya Sterling',
      email: 'student@edunest.com',
      role: UserRole.STUDENT,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      isApproved: true,
      enrolledCourses: ['s1'],
      teachingSubjects: [],
      createdAt: new Date().toISOString()
    }
  ],
  subjects: [
    {
      id: 's1',
      name: 'Quantum Mechanics',
      classLevel: 'Advanced',
      teacherId: 'u2',
      description: 'An introductory course to subatomic particles and wave mechanics.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800'
    }
  ],
  notes: [
    {
      id: 'n1',
      title: 'Schrödinger Equation Basics',
      description: 'Wavefunctions and probability density functions.',
      fileUrl: '#',
      fileType: 'PDF',
      subjectId: 's1',
      uploadedBy: 'u2',
      downloads: 42,
      createdAt: new Date().toISOString()
    }
  ],
  announcements: [
    {
      id: 'a1',
      title: 'Lab Session Update',
      content: 'The Friday session has been moved to Monday at 10 AM.',
      authorId: 'u2',
      subjectId: 's1',
      createdAt: new Date().toISOString()
    }
  ],
  posts: [
    {
      id: 'p1',
      title: 'The Future of Neural Networks',
      content: 'Exploring how deep learning is evolving with transformer architectures.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      authorId: 'u1',
      category: 'Technology',
      tags: ['AI', 'Tech'],
      createdAt: new Date().toISOString()
    }
  ],
  settings: {
    siteName: 'EduNest',
    logo: 'EN',
    primaryColor: '#4f46e5',
    footerText: 'EduNest – Transforming Digital Education.',
    isRegistrationEnabled: true
  }
};

export const db = {
  get: (): DB => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DB;
  },
  save: (data: DB) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};
