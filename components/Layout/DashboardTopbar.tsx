import React from "react";

interface Props {
  onNavigate: (page: string) => void;
}

const DashboardTopbar: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="w-full h-16 bg-white border-b border-emerald-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">

      {/* Left menu */}
      <div className="flex gap-4 sm:gap-8 text-sm font-semibold text-slate-700 overflow-x-auto">

        {/* Optional: show only Home on mobile */}
        <button 
          onClick={() => onNavigate("home")} 
          className="hover:text-emerald-600 whitespace-nowrap"
        >
          Home
        </button>

        <button 
          onClick={() => onNavigate("about")} 
          className="hidden sm:block hover:text-emerald-600 whitespace-nowrap"
        >
          About
        </button>

        <button 
          onClick={() => onNavigate("courses")} 
          className="hidden sm:block hover:text-emerald-600 whitespace-nowrap"
        >
          Courses
        </button>

        <button 
          onClick={() => onNavigate("contact")} 
          className="hidden sm:block hover:text-emerald-600 whitespace-nowrap"
        >
          Contact
        </button>

      </div>

      {/* Right side */}
      <div className="hidden sm:block text-xs text-slate-400 font-medium">
        Digital Learning Platform
      </div>

    </div>
  );
};

export default DashboardTopbar;