import {useRef } from 'react';
import React, { useState,useEffect } from 'react';
import { User, Subject, Note, Announcement } from '../../types';
import DashboardSidebar from '../../components/Layout/DashboardSidebar';
import DashboardTopbar from '../../components/Layout/DashboardTopbar';
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

interface StudentDashboardProps {
  currentUser: User;
  subjects: Subject[];
  announcements: Announcement[];
  onLogout: () => void;
}



const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentUser, subjects, announcements, onLogout }) => {
const [activeTab, setActiveTab] = useState('overview');
const [studyPlan, setStudyPlan] = useState("");
const [loadingPlan, setLoadingPlan] = useState(false);
const [notes, setNotes] = useState([]);
const navigate = useNavigate();

const containerRef = useRef<HTMLDivElement>(null);
const topRef = useRef<HTMLDivElement>(null);
const coursesRef = useRef<HTMLDivElement>(null);
const materialsRef = useRef<HTMLDivElement>(null);
const bookmarksRef = useRef<HTMLDivElement>(null);
const scrollToSection = (id: string) => {
  console.log("Scrolling to:", id); 
  const map: Record<string, React.RefObject<HTMLDivElement>> = {
    overview: topRef,
    "my-courses": coursesRef,
    materials: materialsRef,
    bookmarks: bookmarksRef
  };

  const section = map[id]?.current;
  const container = containerRef.current;

  if (!section || !container) return;

  const containerTop = container.getBoundingClientRect().top;
  const sectionTop = section.getBoundingClientRect().top;

  const scrollPosition = sectionTop - containerTop + container.scrollTop;

  container.scrollTo({
    top: scrollPosition - 20,
    behavior: "smooth",
  });
};

useEffect(() => {
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API}/api/notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setNotes(data);

      // 🔥 create unique topics list
      const map = new Map();
      data.forEach(note => {
        if (note.topicId && !map.has(note.topicId._id)) {
          map.set(note.topicId._id, note.topicId);
        }
      });

      setTopics(Array.from(map.values()));

    } catch (err) {
      console.error("Failed to load notes");
    }
  };

  fetchNotes();
}, []);

 
  const [searchTerm, setSearchTerm] = useState('');
 const [dashboardData, setDashboardData] = useState<any>(null);

useEffect(() => {
  fetch(`${API}/api/student/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => setDashboardData(data));
}, []);



 const [topics, setTopics] = useState<any[]>([]);

  const myNotes = notes;
  const [myCourses,setMyCourses]=useState([]);

useEffect(() => {
  fetch(`${API}/api/courses/my`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => setMyCourses(data));
}, []);

const handleDownload = async (noteId: string) => {
  try {
    const res = await fetch(
      `${API}/api/notes/download/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const data = await res.json();

    window.open(`${API}${data.fileUrl}`, "_blank");
  } catch (err) {
    console.error("Download failed");
  }
};
const generateStudyPlan = async () => {
  setLoadingPlan(true);

  const res = await fetch(`${API}/api/ai/study-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      subjects: myCourses.map((c:any) => c.courseId.title)
    })
  });

  const data = await res.json();
  console.log("AI response:", data);
  setStudyPlan(data.plan);
  setLoadingPlan(false);
};
  return (
<div className="h-screen overflow-hidden bg-gradient-to-b from-white to-emerald-50/30 flex flex-col">

  <DashboardTopbar onNavigate={(p)=>window.location.href='/?page='+p} />

  <div className="flex flex-1 overflow-hidden">
      <div className="hidden lg:block">
    <DashboardSidebar
  currentUser={currentUser}
  activeTab={activeTab}
  onTabChange={scrollToSection}
  onLogout={onLogout}
/>

</div>
<main
  ref={containerRef}
 className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-12"
>


<div ref={topRef} className="scroll-mt-28" >
     <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Learning Journey</h1>
            <p className="text-slate-600">Welcome back, {currentUser.name}. Keep up the great work!</p>
          </div>
          <div className="mt-6 md:mt-0 relative">
             <input 
              type="text" 
              placeholder="Search library..." 
             className="w-full sm:w-64 pl-12 pr-6 py-3 bg-white border border-emerald-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
             <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </header>
</div>




        {/* Learning Stats Hero */}
       {dashboardData && (
<div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-2xl gap-6">

  <div className="relative z-10 max-w-lg">

    <h2 className="text-4xl font-black mb-4">
  Learning Activity
</h2>

<p className="text-emerald-100 leading-relaxed mb-8">
  You have accessed {myNotes.length} study materials from your class topics.
</p>


    <div className="flex space-x-12">
      <div>
        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1">Modules</p>
        <p className="text-3xl font-black">{dashboardData.totalModules}</p>
      </div>

      <div className="w-px h-10 bg-emerald-500/50"></div>

      <div>
        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1">Downloads</p>
        <p className="text-3xl font-black">{dashboardData?.completed || 0}</p>
      </div>
    </div>

  </div>

  <div className="mt-12 md:mt-0 relative z-10">
    <div className="w-48 h-48 rounded-full border-8 border-emerald-500/30 flex items-center justify-center relative">

      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white"
          strokeDasharray="553"
          strokeDashoffset={553 - (553 * dashboardData.progress) / 100}
        />
      </svg>

      <span className="text-4xl font-black">
        {dashboardData.progress}%
      </span>

    </div>
  </div>

</div>
)}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* ================= MY COURSES ================= */}
<section ref={coursesRef} className="scroll-mt-28">
  <h3 className="text-xl font-bold text-slate-900 mb-8">My Courses</h3>

 {myCourses.length === 0 && (
  <div className="bg-white rounded-2xl border border-emerald-100 p-10 text-center">
    <div className="text-4xl mb-3">📚</div>
    <p className="text-slate-600 font-medium">
      You haven't enrolled in any courses yet.
    </p>
    <p className="text-sm text-slate-400 mt-2">
      Start exploring courses and begin your learning journey!
    </p>
  </div>
)}

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
  {myCourses
    .filter((e: any) => e.courseId) // 🟢 prevent null crash
    .map((e: any) => (
      <div
        key={e._id}
       className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-100 shadow-sm p-4 sm:p-6 lg:p-8"
      >
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
          COURSE
        </p>

      <h4 className="text-xl font-bold text-slate-900 mb-2">
  {e.courseId?.title || "Course Removed"}
</h4>
{e.courseId && (
  <button
    onClick={() => navigate(`/course/${e.courseId._id}`)}
    className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-emerald-600 transition-all"
  >
    Continue Learning
  </button>
)}
        <p className="text-xs text-slate-500 mb-4">
          Instructor: {e.courseId.teacherId?.name}
        </p>

       <div className="w-full bg-emerald-100 rounded-full h-2 mb-3 overflow-hidden">
  <div
    className="bg-emerald-600 h-2 rounded-full"
    style={{
      width: `${Math.min(e.progress || 0, 100)}%`,
      maxWidth: "100%"
    }}
  />
</div>
        <p className="text-xs text-slate-500">
          Progress: {e.progress || 0}%
        </p>

      
      </div>
    ))}
</div>
</section>

       

        {/* ================= STUDY MATERIALS ================= */}
            <section ref={materialsRef} className="scroll-mt-28">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Study Materials</h3>
        <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-sm p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
>
                <ul className="divide-y divide-emerald-50">
                  {myNotes.map(n => (
                    <li key={n._id} className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex items-center justify-between gap-3">
                       <div className="flex items-center">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2} /></svg>
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{n.title}</p>
                             <p className="text-xs text-slate-500">Physics Module 01</p>
                          </div>
                       </div>
                     <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
  <button
    onClick={() => handleDownload(n._id)}
    className="p-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg"
  >
    Download
  </button>
</div>
                    </li>
                  ))}
                  {myNotes.length === 0 && <li className="py-20 text-center text-slate-500 text-sm">No notes shared for your subjects yet.</li>}
                </ul>
              </div>
            </section>

<section ref={bookmarksRef} className="scroll-mt-28">
  <h3 className="text-xl font-bold text-slate-900 mb-8">Bookmarks</h3>

  <div className="bg-white rounded-2xl p-8 border border-emerald-100">
    <p className="text-slate-500 text-sm">
      No bookmarks added yet.
    </p>
  </div>
</section>
          </div>

          <div className="space-y-12">
             <section>
                <h3 className="text-xl font-bold text-slate-900 mb-8">Latest Updates</h3>
                <div className="space-y-4">
                  {announcements.map(a => (
                    <div key={a.id} className="bg-white p-8 rounded-[2rem] border-l-4 border-emerald-600 shadow-sm relative group overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">NEW ALERT</p>
                       <h4 className="font-bold text-slate-900 mb-2 relative z-10">{a.title}</h4>
                       <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 relative z-10">{a.content}</p>
                       <span className="text-[10px] font-bold text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
             </section>

             <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2.5rem] p-10 text-white relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                <h4 className="text-xl font-bold mb-4">Study Plan AI</h4>
                <p className="text-emerald-100 text-sm mb-8 leading-relaxed">Let Gemini generate a personalized 4-week study path for your upcoming exams based on your subjects.</p>
                <button className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all" onClick={generateStudyPlan}>
                  {loadingPlan ? "Generating..." : "Generate Path"}
                </button>
             </div>
             {studyPlan && (
  <div className="mt-4 bg-white p-4 rounded-xl text-sm whitespace-pre-line max-h-64 overflow-auto">
    {studyPlan}
  </div>
)}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
