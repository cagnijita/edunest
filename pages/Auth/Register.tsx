
import React, { useState, useEffect} from 'react';
import { UserRole } from '../../types';
const API = import.meta.env.VITE_API_URL;

const Register: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' , role: 'student',classId: "" });
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/academic/classes`)
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          classId: formData.role === "student" ? classId : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Registration successful! Please login.");
      onNavigate("login");
      setLoading(false);

    } catch (err:any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 flex items-center justify-center bg-gradient-to-br from-white via-emerald-50/30 to-white px-4 sm:px-6 relative overflow-visible">
      {/* Decorative Background Elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -mr-48 opacity-50"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-emerald-50/30 rounded-full blur-3xl -ml-40 opacity-40"></div>

     <div className="max-w-md w-full z-10 animate-fade-in relative">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-emerald-600/40">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Join EduNest</h2>
            <p className="text-slate-500 text-sm">Start your learning journey today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-in-up">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-8 p-1 bg-emerald-50 rounded-xl border border-emerald-200">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: "student"})}
                className={`py-2.5 px-4 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${formData.role === UserRole.STUDENT ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-400/50' : 'text-slate-600 hover:text-slate-700'}`}
              >
                Student
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: "teacher"})}
                className={`py-2.5 px-4 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${formData.role === UserRole.TEACHER ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-400/50' : 'text-slate-600 hover:text-slate-700'}`}
              >
                Teacher
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl font-medium input-invert"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Email Address</label>
              <input 
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* Class Selector */}
            {formData.role === "student" && (
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Select Your Class</label>
                <select
                  required
                 <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                >
                  <option value="">Choose a class...</option>
                  {classes.map((c:any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-8 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-600/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500 font-medium">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-3 border-2 border-emerald-200 text-emerald-600 rounded-xl font-black text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 uppercase tracking-wider"
          >
            Sign In
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-8 font-medium">
          By signing up, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
};

export default Register;

