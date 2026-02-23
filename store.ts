
import { useState, useEffect, useCallback } from 'react';
import { User, Subject, Note, Announcement, Post, SiteSettings } from './types';
import { api } from './api';
import { db } from './db';

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edunest_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(db.get().settings);

  const refreshData = useCallback(() => {
    const data = db.get();
    setSubjects(data.subjects);
    setNotes(data.notes);
    setAnnouncements(data.announcements);
    setPosts(data.posts);
    setUsers(data.users);
    setSettings(data.settings);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const login = (email: string) => {
    const user = api.auth.login(email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('edunest_session', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edunest_session');
  };

  return {
    currentUser,
    subjects,
    notes,
    announcements,
    posts,
    users,
    settings,
    login,
    logout,
    refreshData
  };
};
