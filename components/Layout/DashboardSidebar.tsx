
import React from 'react';
import { User, UserRole } from '../../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ currentUser, activeTab, onTabChange, onLogout, onNavigate }) => {
  const getLinks = () => {
    switch (currentUser.role) {
      case UserRole.ADMIN:
        return [
          { id: 'overview', name: 'Overview', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
          { id: 'users', name: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
          { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
        ];
      case UserRole.TEACHER:
        return [
          { id: 'notes', name: 'Notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { id: 'announcements', name: 'Announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
          { id: 'classes', name: 'My Classes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.75 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
{ id: 'my-courses', name: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.75 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
        ];
      default:
        return [
          { id: 'my-courses', name: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.75 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
          { id: 'materials', name: 'Library', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
          { id: 'bookmarks', name: 'Bookmarks', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' }
        ];
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-emerald-50/30 h-full flex flex-col transition-all duration-300 border-r border-emerald-200">
      <div className="p-6 flex items-center space-x-3 border-b border-emerald-200">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">EN</div>
        <span className="text-slate-900 font-bold text-xl tracking-tight">EduNest</span>
      </div>

      <div className="flex-1 px-4 py-8 space-y-2 custom-scrollbar overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Main Menu</p>
        {getLinks().map(link => (
          <button
            key={link.id}
            type="button"
          onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();

  if (link.id === "my-courses" && onNavigate) {
    onNavigate("my-courses");   // 🔥 CHANGE PAGE
  } else {
    onTabChange(link.id);       // Normal dashboard tab
  }
}}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${activeTab === link.id
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/40'
                : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-100/50'
              }`}
          >
            <svg className={`w-5 h-5 mr-3 transition-colors ${activeTab === link.id ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
            </svg>
            {link.name}
          </button>
        ))}

      </div>

      <div className="p-4 border-t border-emerald-200">
        <div className="flex items-center p-2 mb-4">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-emerald-200" alt="" />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-600 truncate capitalize">{currentUser.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
