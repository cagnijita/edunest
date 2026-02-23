import React, { useEffect, useState } from "react";

const TeacherMyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses/teacher/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Page Title */}
        <div className="mb-14">
          <h1 className="text-4xl font-black text-slate-900">
            My Created Courses
          </h1>
          <p className="text-slate-500 mt-2">
            Manage and monitor all the courses you've built.
          </p>
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="bg-white p-12 rounded-[2rem] border border-emerald-100 shadow-md text-center">
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No courses yet
            </h2>
            <p className="text-slate-500">
              Start creating your first course to see it here.
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course: any) => (
            <div
              key={course._id}
              className="group bg-white rounded-[2rem] overflow-hidden border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white px-4 py-1 rounded-full text-sm font-bold shadow">
                  {course.isPaid ? `₹${course.price}` : "Free"}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-3 line-clamp-1">
                  {course.title}
                </h2>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {course.description}
                </p>

                {/* Bottom Section */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    Published
                  </span>

    <button
  onClick={() => {
    window.location.href = `/course/${course._id}`;
  }}
  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md"
>
  Manage
</button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TeacherMyCourses;