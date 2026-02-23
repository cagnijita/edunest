import React from "react";

const posts = [
  {
    id: 1,
    title: "Why Structured Courses Improve Learning Efficiency",
    description:
      "A well-organized course helps students understand concepts faster and retain knowledge longer compared to unstructured learning.",
    category: "Learning",
    date: "February 2026",
  },
  {
    id: 2,
    title: "The Role of Digital Classrooms in Modern Education",
    description:
      "Digital platforms allow teachers to guide students beyond physical classrooms and provide continuous learning support.",
    category: "Education Technology",
    date: "January 2026",
  },
  {
    id: 3,
    title: "How Teachers Can Design Effective Online Courses",
    description:
      "Practical techniques teachers can use to create engaging and easy-to-follow online learning paths.",
    category: "Teaching",
    date: "December 2025",
  },
  {
    id: 4,
    title: "Tracking Student Progress: Why It Matters",
    description:
      "Monitoring progress helps students stay motivated and allows teachers to identify learning gaps early.",
    category: "Student Growth",
    date: "November 2025",
  },
];

export default function Blog() {
  return (
    <div className="pt-32 bg-gradient-to-b from-white to-emerald-50 min-h-screen">

      {/* HERO */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6">
            EduNest <span className="text-[#069B6C]">Blog</span>
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed">
            Articles and insights about structured learning, teaching methods and digital education.
          </p>
        </div>
      </section>


      {/* POSTS GRID */}
      <section className="bg-white py-24 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {posts.map(post => (
            <article
              key={post.id}
              className="group bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* top accent bar */}
              <div className="h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>

              <div className="p-8">
                <span className="text-xs font-bold text-[#069B6C] uppercase tracking-widest">
                  {post.category} • {post.date}
                </span>

                <h2 className="text-xl font-bold text-slate-900 mt-3 mb-3 leading-snug group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </h2>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {post.description}
                </p>

                <button className="text-[#069B6C] font-semibold hover:underline">
                  Read Article
                </button>
              </div>
            </article>
          ))}

        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="bg-emerald-50 py-24 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Stay updated with learning insights
          </h2>

          <p className="text-slate-600 mb-10">
            New articles on education, teaching strategies and student growth.
          </p>

          <div className="flex max-w-md mx-auto gap-3">
            <input
              className="flex-1 px-4 py-3 rounded-2xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your email"
            />
            <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/40 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}