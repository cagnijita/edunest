

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Routes, Route } from "react-router-dom";

import React, { useState } from 'react';
import { useStore } from './store';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import Courses from "./pages/Courses";
import CoursePlayer from "./pages/CoursePlayer";
import { useLocation } from "react-router-dom";
import About from "./pages/About";
import Blog from "./pages/Blog";
import MyCourses from './pages/TeacherMyCourses';
const App: React.FC = () => {
  const location = useLocation();
 const { subjects, notes, announcements, users, settings } = useStore();
const [courseId, setCourseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || "home";
})
const isCourseRoute = location.pathname.startsWith("/course");
// Sync React → URL (source of truth)
useEffect(() => {
  // do nothing if we are inside course player
  if (location.pathname.startsWith("/course/")) return;

  const url = new URL(window.location);
  url.searchParams.set("page", currentPage);
  window.history.replaceState({}, "", url);
}, [currentPage, location.pathname]);


 const [authUser, setAuthUser] = useState(() => {
  const saved = localStorage.getItem("user");
  if (!saved) return null;

  const parsed = JSON.parse(saved);
  return {
    ...parsed,
    role: parsed.role?.toLowerCase()
  };
});
useEffect(() => {
  if (!authUser) return;

  if (currentPage === "login" || currentPage === "register") {
    if (authUser.role === "teacher") {
      setCurrentPage("teacher-dashboard");
    } else if (authUser.role === "student") {
      setCurrentPage("student-dashboard");
    } else if (authUser.role === "admin") {
      setCurrentPage("admin-dashboard");
    }
  }
}, [authUser]);



//Restore Session
// useEffect(() => {
//   const restoreSession = () => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     if (token && user) {
//       setAuthUser(JSON.parse(user));
//     } else {
//       setAuthUser(null);
//     }
//   };

//   restoreSession();
// }, []);

useEffect(() => {
  const path = location.pathname;

  if (path.startsWith("/course/")) {
    const id = path.split("/course/")[1];
    setCourseId(id);
  } else {
    setCourseId(null);
  }
}, [location.pathname]);
useEffect(() => {
  if (currentPage !== "reset-password") {
    localStorage.removeItem("resetToken");
  }
}, [currentPage]);




useEffect(() => {
  const handleFocus = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setAuthUser(JSON.parse(savedUser));
  };

  window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, []);

useEffect(() => {
  const path = window.location.pathname;

  if (path.startsWith("/course/")) {
    const id = path.split("/course/")[1];
    setCourseId(id);
  }
}, []);

useEffect(() => {
  const handlePop = () => {
    const path = window.location.pathname;

    if (!path.startsWith("/course/")) {
      setCourseId(null);

      const params = new URLSearchParams(window.location.search);
      setCurrentPage(params.get("page") || "home");
    }
  };

  window.addEventListener("popstate", handlePop);
  return () => window.removeEventListener("popstate", handlePop);
}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setAuthUser(null);
 window.location.href = "/";
};


  const isDashboard = currentPage.includes('dashboard');
const routerNavigate = useNavigate();

const navigatePage = (page: string) => {
  routerNavigate("/");              // leave /course route
  setTimeout(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.history.replaceState({}, "", url);
    setCurrentPage(page);
  }, 0);
};
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
     case 'login':
  return <Login setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;

      case 'register': return <Register onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
  return authUser?.role === "admin"
    ? <AdminDashboard currentUser={authUser} users={users} subjects={subjects} onLogout={handleLogout} />
    : <Login setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;

case 'teacher-dashboard':
  if (!authUser) return <Login setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;
  if (authUser.role !== "teacher") return <Home onNavigate={setCurrentPage} />;

  return <TeacherDashboard currentUser={authUser} subjects={subjects} notes={notes} announcements={announcements} onLogout={handleLogout} onNavigate={setCurrentPage} />;


case 'student-dashboard':
  return authUser?.role === "student"
    ? <StudentDashboard currentUser={authUser} subjects={subjects} notes={notes} announcements={announcements} onLogout={handleLogout} />
    : <Login setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;

    
        return (
          <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-slate-900 mb-12">Academic Catalog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {subjects.map(s => (
                <div key={s.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-emerald-100 shadow-md shadow-emerald-100/50 group hover:shadow-xl hover:shadow-emerald-200/50 transition-all">
                  <div className="h-48 overflow-hidden"><img src={s.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /></div>
                  <div className="p-10">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{s.classLevel}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">{s.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8">{s.description}</p>
                    <button onClick={() => setCurrentPage('login')} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-bold text-sm hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-600/40">Enroll in Class</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        case 'forgot-password':
  return <ForgotPassword setCurrentPage={setCurrentPage} />;

case 'reset-password':
  return <ResetPassword onNavigate={setCurrentPage} />;
case "contact":
  return <Contact />;

case "help":
  return <HelpCenter />;
case 'courses':
  return <Courses />;
  case 'my-courses':
  if (!authUser) {
    return <Login setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;
  }

if (authUser?.role === "teacher") {
  return <MyCourses />;
}

  if (authUser.role === "student") {
    return <StudentDashboard 
      currentUser={authUser} 
      subjects={subjects} 
      notes={notes} 
      announcements={announcements} 
      onLogout={handleLogout} 
    />;
  }

  return <Home onNavigate={setCurrentPage} />;
  case "about":
  return <About />;

case "blog":
  return <Blog />;

      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar currentUser={authUser} settings={settings} onNavigate={navigatePage} onLogout={handleLogout} />}
   <main className="flex-grow">
 {location.pathname.startsWith("/course/")
  ? (
    <div key={location.pathname}>
      <CoursePlayer courseId={location.pathname.split("/course/")[1]} />
    </div>
  )
  : renderPage()
}
</main>
      {!isDashboard && (
        <footer className="bg-gradient-to-b from-white to-emerald-50 py-24 text-slate-900 border-t border-emerald-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
              <div className="col-span-2">
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl mr-3">{settings.logo}</div>
                  <span className="text-2xl font-black tracking-tight text-slate-900">{settings.siteName}</span>
                </div>
                <p className="text-slate-600 max-w-sm leading-relaxed mb-8">{settings.footerText}</p>
                <div className="flex space-x-4">
                  {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 cursor-pointer transition-all"><div className="w-4 h-4 bg-slate-400/30 rounded"></div></div>)}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-8">Resources</h4>
                <ul className="space-y-4 text-slate-600 text-sm">
                  <li><button onClick={() => setCurrentPage('subjects')} className="hover:text-emerald-600 transition-colors font-medium">Subjects Catalog</button></li>
                  <li><button onClick={() => setCurrentPage('blog')} className="hover:text-emerald-600 transition-colors font-medium">Educational Blog</button></li>
                  <li><button className="hover:text-emerald-600 transition-colors font-medium">Documentation</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-8">Support</h4>
                <ul className="space-y-4 text-slate-600 text-sm">
                  <li><button onClick={() => setCurrentPage("help")} className="hover:text-emerald-600 transition-colors font-medium">
  Help Center
</button>
</li>
                  <li><button onClick={() => setCurrentPage('contact')} className="hover:text-emerald-600 transition-colors font-medium">Contact Us</button></li>
                  <li><button className="hover:text-emerald-600 transition-colors font-medium">Privacy Policy</button></li>
                </ul>
              </div>
            </div>
            <div className="pt-12 border-t border-emerald-200 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               &copy; {new Date().getFullYear()} {settings.siteName} Learning Management.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
