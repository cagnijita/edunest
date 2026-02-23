
import { db } from './db';
import { User, Note, Announcement, Subject, UserRole } from './types';

export const api = {
  auth: {
    login: (email: string) => {
      const data = db.get();
      return data.users.find(u => u.email === email) || null;
    },
    register: (user: Partial<User>) => {
      const data = db.get();
      const newUser = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
        isApproved: user.role === UserRole.STUDENT,
        enrolledCourses: [],
        teachingSubjects: [],
        createdAt: new Date().toISOString()
      } as User;
      data.users.push(newUser);
      db.save(data);
      return newUser;
    }
  },
  notes: {
    getAll: () => db.get().notes,
    create: (note: Omit<Note, 'id' | 'createdAt' | 'downloads'>) => {
      const data = db.get();
      const newNote = {
        ...note,
        id: 'n' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        downloads: 0
      } as Note;
      data.notes.push(newNote);
      db.save(data);
      return newNote;
    },
    download: (id: string) => {
      const data = db.get();
      const note = data.notes.find(n => n.id === id);
      if (note) note.downloads++;
      db.save(data);
    }
  },
  subjects: {
    getAll: () => db.get().subjects,
    create: (subj: Omit<Subject, 'id'>) => {
      const data = db.get();
      const newSubj = { ...subj, id: 's' + Math.random().toString(36).substr(2, 9) };
      data.subjects.push(newSubj);
      db.save(data);
      return newSubj;
    }
  },
  users: {
    getAll: () => db.get().users,
    approve: (id: string) => {
      const data = db.get();
      const user = data.users.find(u => u.id === id);
      if (user) user.isApproved = true;
      db.save(data);
    }
  }
};
