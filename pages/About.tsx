import React from "react";

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-white to-emerald-50 min-h-screen">

      {/* HERO */}
 <section className="bg-gradient-to-b from-white to-emerald-50 py-24 mb-24">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h1 className="text-5xl font-black text-slate-900 mb-6">
      About <span className="text-[#069B6C]">EduNest</span>
    </h1>

    <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
      EduNest is a modern learning platform designed to connect teachers and students
      through structured digital education.
    </p>
  </div>
</section>

      {/* PURPOSE */}
<section className="bg-white py-24">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Why EduNest Exists
          </h2>

          <p className="text-slate-600 mb-4 leading-relaxed">
            Traditional learning outside the classroom often lacks structure.
            Students watch disconnected content and struggle to track improvement,
            while teachers cannot properly guide learners individually.
          </p>

          <p className="text-slate-600 leading-relaxed">
            EduNest provides a structured environment where teachers design complete
            courses and students follow a clear learning path from beginning to completion.
          </p>
        </div>

        <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-10 shadow-sm">
          <h3 className="text-xl font-bold text-[#069B6C] mb-6">
            Platform Capabilities
          </h3>

          <ul className="space-y-4 text-slate-700">
            <li>Teacher created structured courses</li>
            <li>Student enrollment and guided learning</li>
            <li>Progress tracking and completion monitoring</li>
            <li>Lessons containing videos, notes and quizzes</li>
            <li>Accessible learning from any location</li>
          </ul>
        </div>
        </div>
      </section>

      {/* FEATURES */}
     <section className="bg-emerald-50 py-24">
  <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-14">
          Platform Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white rounded-3xl p-8 shadow-md border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-bold text-lg text-[#069B6C] mb-3">
              Teacher Dashboard
            </h3>
            <p className="text-slate-600">
              Create courses, upload lessons and manage students through an organized interface.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow border border-emerald-100 hover:shadow-xl transition">
            <h3 className="font-bold text-lg text-[#069B6C] mb-3">
              Student Learning
            </h3>
            <p className="text-slate-600">
              Enroll in courses, continue lessons anytime and follow a structured learning path.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow border border-emerald-100 hover:shadow-xl transition">
            <h3 className="font-bold text-lg text-[#069B6C] mb-3">
              Progress Tracking
            </h3>
            <p className="text-slate-600">
              Monitor course completion and improvement instead of guessing learning outcomes.
            </p>
          </div>

        </div>
        </div>
      </section>

      {/* VISION */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Our Vision
        </h2>

        <p className="text-slate-600 text-lg leading-relaxed">
          EduNest aims to make education structured, accessible and measurable.
          Learning should not only deliver information but guide progress.
          Our goal is to create a platform where teaching and learning remain connected,
          organized and continuously improving.
        </p>
      </section>

    </div>
  );
}