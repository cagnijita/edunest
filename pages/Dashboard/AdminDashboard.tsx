
import React, { useState } from 'react';
import { User, Subject, UserRole } from '../../types';
import DashboardSidebar from '../../components/Layout/DashboardSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  subjects: Subject[];
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, users, subjects, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: users.length, color: 'indigo' },
    { label: 'Verified Teachers', value: users.filter(u => u.role === UserRole.TEACHER && u.isApproved).length, color: 'emerald' },
    { label: 'Active Subjects', value: subjects.length, color: 'amber' },
    { label: 'Pending Approvals', value: users.filter(u => !u.isApproved).length, color: 'rose' }
  ];

  const chartData = [
    { name: 'Mon', users: 120 }, { name: 'Tue', users: 150 }, { name: 'Wed', users: 200 },
    { name: 'Thu', users: 180 }, { name: 'Fri', users: 220 }, { name: 'Sat', users: 110 }, { name: 'Sun', users: 95 }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-white to-emerald-50/30">
      <DashboardSidebar currentUser={currentUser} activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">System Control</h1>
            <p className="text-slate-600">Platform-wide health and user management.</p>
          </div>
          <div className="flex space-x-4">
             <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/40">Invite User</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white p-8 rounded-[2rem] border border-emerald-200 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">{s.label}</p>
              <h3 className="text-4xl font-black text-slate-900">{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-emerald-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8">User Engagement</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#059669', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#059669', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f0fdf4'}} />
                  <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-200 shadow-sm overflow-hidden">
             <h3 className="text-xl font-bold text-slate-900 mb-8">Pending Staff</h3>
             <div className="space-y-6">
                {users.filter(u => !u.isApproved).map(u => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={u.avatar} className="w-10 h-10 rounded-full mr-3" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-200 transition-colors">Approve</button>
                  </div>
                ))}
                {users.filter(u => !u.isApproved).length === 0 && <p className="text-center py-10 text-slate-500 text-sm">No pending approvals.</p>}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
