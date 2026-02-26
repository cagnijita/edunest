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
    <nav className="fixed top-0 left-0 right-0 z-50 
    backdrop-blur-xl bg-white/70 
    border-b border-emerald-100 
    shadow-sm">

     <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">

        {/* LEFT */}
        <div className="flex items-center space-x-4">

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <svg className="w-7 h-7 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* LOGO */}
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center group"
          >
            <div className="
              w-10 h-10 
              bg-gradient-to-br from-emerald-600 to-emerald-500 
              rounded-xl 
              flex items-center justify-center 
              text-white font-black text-xl mr-3 
              shadow-lg shadow-emerald-500/30
              group-hover:scale-110
              transition-all duration-300
            ">
              {settings.logo}
            </div>

           <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate max-w-[120px] sm:max-w-none">
              {settings.siteName}
            </span>
          </button>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center space-x-8 ml-6">

            {['home', 'courses', 'blog', 'about', 'contact'].map(link => (
              <button
                key={link}
                onClick={() => onNavigate(link)}
                className="
                relative
                text-sm font-semibold 
                text-slate-600 
                hover:text-emerald-600
                transition
                after:absolute
                after:left-0
                after:-bottom-1
                after:w-0
                after:h-[2px]
                after:bg-emerald-500
                after:transition-all
                hover:after:w-full
                "
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </button>
            ))}

          </div>
        </div>


        {/* RIGHT */}
        <div className="flex items-center space-x-2 min-w-0">

          {currentUser ? (
            <div className="flex items-center space-x-3">

              <button
                onClick={() => {
                  const page = getDashboard(currentUser.role);
                  localStorage.setItem("lastDashboard", page);
                  onNavigate(page);
                }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-3 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap"
              >
                Dashboard
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>

              <button
                onClick={onLogout}
                className="
                p-2 rounded-lg
                text-slate-500
                hover:text-red-500
                hover:bg-red-50
                transition
                "
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                </svg>
              </button>

            </div>
          ) : (

           <div className="flex items-center space-x-2 flex-shrink-0">

              <button
                onClick={() => onNavigate('login')}
                className="
                text-sm font-semibold 
                text-slate-600 
                hover:text-emerald-600
                transition
                "
              >
                Login
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="
                bg-gradient-to-r from-emerald-600 to-emerald-500
                text-white
                px-6 py-2.5
                rounded-xl
                text-sm font-semibold
                shadow-md shadow-emerald-500/30
                hover:shadow-lg hover:scale-105
                transition-all
                "
              >
                Get Started
              </button>

            </div>

          )}

        </div>

      </div>


{/* MOBILE MENU */}
{mobileOpen && (

  <div className="
  lg:hidden
  bg-white
  border-t border-emerald-100
  shadow-lg
  animate-fade-in
  ">

    <div className="flex flex-col px-6 py-5 gap-3">

      {['home','courses','blog','about','contact'].map(link => (

        <button
          key={link}
          onClick={()=>{
            setMobileOpen(false);
            onNavigate(link);
          }}
          className="
          text-left
          px-3 py-2
          rounded-lg
          font-medium
          text-slate-700
          hover:bg-emerald-50
          hover:text-emerald-600
          transition
          "
        >
          {link.charAt(0).toUpperCase()+link.slice(1)}
        </button>

      ))}

    </div>

  </div>

)}

    </nav>
  );
};

export default Navbar;