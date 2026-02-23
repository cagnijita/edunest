
import React, {useState,useEffect} from 'react';
import { User, SiteSettings } from '../../types';


interface NavbarProps {
  currentUser: User | null;
  settings: SiteSettings;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, settings, onNavigate, onLogout }) => {
 const getDashboard = (role: string) => {
  if (role === "admin") return "admin-dashboard";
  if (role === "teacher") return "teacher-dashboard";
  return "student-dashboard";
};
const [mobileOpen, setMobileOpen] = useState(false);


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-emerald-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          

<button
  className="lg:hidden mr-2"
onClick={() => setMobileOpen(prev => !prev)}
>
  <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
          <button onClick={() => onNavigate('home')} className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl mr-3 group-hover:rotate-6 transition-transform shadow-lg shadow-emerald-600/40">
              {settings.logo}
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{settings.siteName}</span>
          </button>

         <div className="hidden lg:flex items-center space-x-8">
  {['home', 'courses', 'blog', 'about', 'contact'].map(link => (
    <button
      key={link}
      onClick={() => onNavigate(link)}
      className="text-xs font-bold text-slate-600 hover:text-emerald-600 uppercase tracking-widest transition-colors"
    >
      {link.charAt(0).toUpperCase() + link.slice(1)}
    </button>
  ))}
</div>

        </div>

        <div className="flex items-center space-x-6">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <button
              onClick={() => {
const page = getDashboard(currentUser.role);
localStorage.setItem("lastDashboard", page);
onNavigate(page);

}}

                className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/40 hover:shadow-xl hover:shadow-emerald-500/50 transition-all flex items-center"
              >
                Dashboard
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <button onClick={onLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Login</button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-600/40 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
   
{/* MOBILE COLLAPSIBLE MENU — NOT OVERLAY */}
{mobileOpen && (
  <div className="lg:hidden bg-white border-t border-emerald-200 shadow-sm">

    <div className="flex flex-col px-6 py-4 gap-4">

      {['home','courses','blog','about','contact'].map(link => (
        <button
          key={link}
          onClick={()=>{
            setMobileOpen(false);
            onNavigate(link);
          }}
          className="text-left font-semibold text-slate-700 hover:text-emerald-600"
        >
          {link.charAt(0).toUpperCase()+link.slice(1)}
        </button>
      ))}

      <hr className="my-2"/>

      {/* {currentUser ? (
        <>
          <button
            onClick={()=>{
              setMobileOpen(false);
              const page = getDashboard(currentUser.role);
              onNavigate(page);
            }}
            className="bg-emerald-600 text-white py-2 rounded-lg font-semibold"
          >
            Dashboard
          </button>

          <button
            onClick={()=>{
              setMobileOpen(false);
              onLogout();
            }}
            className="text-red-500 text-left font-semibold"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={()=>{setMobileOpen(false);onNavigate('login')}}
            className="text-left"
          >
            Login
          </button>

          <button
            onClick={()=>{setMobileOpen(false);onNavigate('register')}}
            className="bg-emerald-600 text-white py-2 rounded-lg"
          >
            Register
          </button>
        </>
      )} */}

    </div>
  </div>
)}
    </nav>
  );
};

export default Navbar;
