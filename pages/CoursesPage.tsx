import React, { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL;
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(()=>{
    fetch(`${API}/api/courses`)
      .then(res=>res.json())
      .then(setCourses);
  },[]);

  const enroll = async (id:string)=>{
    await fetch(`${API}/api/courses/enroll/${id}`,{
      method:"POST",
      headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` }
    });
    alert("Enrolled!");
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-10">
      {courses.map(c=>(
        <div key={c._id} className="bg-white rounded-xl p-4 shadow">
          <img src={c.thumbnail} className="rounded mb-3"/>
          <h2 className="font-bold">{c.title}</h2>
          <p className="text-sm text-gray-500">{c.description}</p>

          <button
            onClick={()=>enroll(c._id)}
            className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Enroll
          </button>
        </div>
      ))}
    </div>
  );
};
