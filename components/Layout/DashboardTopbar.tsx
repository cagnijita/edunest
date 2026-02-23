import React from "react";

interface Props {
  onNavigate: (page: string) => void;
}

const DashboardTopbar: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="w-full h-16 bg-white border-b border-emerald-100 flex items-center justify-between px-8 shadow-sm">

      {/* Left menu */}
      <div className="flex gap-8 text-sm font-semibold text-slate-700">
        <button onClick={() => onNavigate("home")} className="hover:text-emerald-600">Home</button>
        <button onClick={() => onNavigate("about")} className="hover:text-emerald-600">About</button>
        <button onClick={() => onNavigate("courses")} className="hover:text-emerald-600">Courses</button>
        <button onClick={() => onNavigate("contact")} className="hover:text-emerald-600">Contact</button>
      </div>

      {/* Right side */}
      <div className="text-xs text-slate-400 font-medium">
        Digital Learning Platform
      </div>

    </div>
  );
};

export default DashboardTopbar;
