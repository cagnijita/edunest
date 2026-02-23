
import React from 'react';

const Home: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/20 rounded-full blur-[120px] -ml-48 -mb-48 opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">New Standard for LMS</span>
              </div>
<h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
  Redefining academic excellence <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-[#0000008a]">in a digital world.</span>
</h1>

             <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-lg">
  EduNest blends structured courses, real progress tracking, and AI-powered guidance to help students learn with clarity and confidence.
</p>
              <div className="flex space-x-6">
               <button
  onClick={() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      if (parsed.role === "teacher") {
        onNavigate("teacher-dashboard");
      } else {
        onNavigate("student-dashboard");
      }
    } else {
      onNavigate("register");
    }
  }}
  className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-emerald-600/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:-translate-y-1"
>
  Start Learning
</button>
                <button onClick={() => onNavigate('courses')} className="px-10 py-5 bg-white text-slate-900 border border-emerald-200 rounded-[2rem] font-black text-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all">Explore Classes</button>
              </div>
            </div>
            <div className="relative mt-20 lg:mt-0">
               <div className="relative rounded-[3rem] overflow-hidden shadow-3xl border-[12px] border-white/60">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" className="w-full" alt="Students" />
                  {/* <div className="absolute bottom-10 left-10 p-8 glass rounded-[2rem] border border-emerald-300/50 shadow-2xl max-w-xs">
                     <p className="text-slate-900 font-black text-lg mb-2">AI-Powered Insights</p>
                     <p className="text-slate-600 text-sm">Summarize lectures and notes instantly with Gemini 3 Pro.</p>
                  </div> */}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gradient-to-b from-white to-emerald-50/40 border-y border-emerald-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Built for Excellence</h2>
            <p className="text-lg text-slate-600">Every feature is designed to eliminate friction in the academic journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Secure Storage', desc: 'Enterprise-grade encryption for all your study materials and data.', icon: '🛡️' },
              { title: 'Role Access', desc: 'Granular permissions for Admins, Teachers, and Students.', icon: '🔑' },
              { title: 'AI Assistance', desc: 'Advanced summarization and study planning via Gemini API.', icon: '🤖' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all group">
                <div className="text-4xl mb-8 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
