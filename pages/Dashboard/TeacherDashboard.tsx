
import React, { useState, useEffect } from 'react';
import { User, Subject, Note, Announcement } from '../../types';
import DashboardSidebar from '../../components/Layout/DashboardSidebar';
import DashboardTopbar from '../../components/Layout/DashboardTopbar';
import { useNavigate } from "react-router-dom";
import { generateSummary } from '../../services/geminiService';
import { create } from 'domain';

interface TeacherDashboardProps {
  currentUser: User;
  subjects: Subject[];
  notes: Note[];
  announcements: Announcement[];
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, subjects, notes, announcements, onLogout }) => {
  const [activeTab, setActiveTab] = useState("notes");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [classes, setClasses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [teacherNotes, setTeacherNotes] = useState([]);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editTopics, setEditTopics] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseThumb, setCourseThumb] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [myCourses, setMyCourses] = useState([]);

const role = currentUser.role?.toLowerCase();

const defaultTab =
  role === "teacher"
    ? "notes"
    : role === "admin"
      ? "overview"
      : "my-courses";


  const teacherSubjects = subjects.filter(s => s.teacherId === currentUser.id);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/academic/classes")
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;

    fetch(`http://localhost:5000/api/topics/${selectedClass}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);   // prevents crash
      });

  }, [selectedClass]);



  const fetchTeacherCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/teacher/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      console.log("Teacher Courses:", data);

      setMyCourses(data);

    } catch (err) {
      console.error("Failed to fetch teacher courses");
    }
  }

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const handleSummarize = async (noteId: string) => {
    setIsSummarizing(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ noteId })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setAiSummary(data.summary);

    } catch (err) {
      alert("Failed to generate summary");
    }

    setIsSummarizing(false);
  };

  const loadNotes = async () => {
    const res = await fetch("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    setTeacherNotes(data);
  };

  useEffect(() => {
    loadNotes();
  }, []);



  const handleUpload = async () => {
    if (!file || !title || !selectedClass || !selectedTopic) {
      alert("Select class and topic");
      return;
    }


    const formData = new FormData();
    formData.append("title", title);
    formData.append("topicId", selectedTopic);
    formData.append("file", file);

   
      try {
        const res = await fetch("http://localhost:5000/api/notes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        alert("Note uploaded successfully!");

        setSelectedTopic("");
        setTitle("");
        setFile(null);
        loadNotes();

      } catch (err) {
        alert("Upload failed");
      }
    };

    const createTopic = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/topics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            name: newTopic,
            classId: selectedClass
          })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to create topic");
          return;
        }

        setTopics(prev => [...prev, data]);
        setSelectedTopic(data._id);
        setNewTopic("");

      } catch (err) {
        console.error("Topic create error:", err);
        alert("Server error while creating topic");
      }
    };

    const createCourse = async () => {
      if (!courseTitle.trim() || !courseThumb.trim() || !courseDesc.trim()) {
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            title: courseTitle,
            description: courseDesc,
            thumbnail: courseThumb,
            isPaid,
            price: isPaid ? Number(price) : 0
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        alert("Course created successfully!");

        setCourseTitle("");
        setCourseThumb("");
        setCourseDesc("");
        setPrice("");
        setIsPaid(false);

        fetchTeacherCourses();

      } catch (err) {
        console.error(err);
        alert("Failed to create course");
      }
    };

    return (
      <div className="flex min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
        <div className="hidden lg:block">
          <DashboardSidebar
            currentUser={currentUser}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={onLogout}
            
          onNavigate={(page) => window.location.href = "/?page=" + page}
          />
        </div>


        <div className="flex-1 flex flex-col">
          <DashboardTopbar onNavigate={(p) => window.location.href = '/?page=' + p} />
          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10">
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Academic Workspace</h1>
                <p className="text-slate-600">Welcome back, {currentUser.name}.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer max-w-xs">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  <span className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-sm whitespace-nowrap">
                    {file ? "Change File" : "Choose File"}
                  </span>

                  <span className="text-sm text-slate-600 truncate">
                    {file ? file.name : "No file selected"}
                  </span>
                </label>


                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-emerald-500/40 w-full sm:w-64
  bg-[#0B1A2B] text-white placeholder:text-slate-400 caret-white
  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />


                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 rounded-md border border-emerald-200 bg-white">
                  <option value="">Select Class</option>
                  {classes.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="px-3 py-2 rounded-md border border-emerald-200 bg-white">
                  <option value="">Select Topic</option>
                  {topics.map((t: any) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Create new topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="border px-3 py-2 rounded"
                  />

                  <button
                    type="button"
                    onClick={createTopic}
                    className="bg-emerald-600 text-white px-4 py-2 rounded"
                  >
                    Add Topic
                  </button>
                </div>

                <button onClick={handleUpload} className="px-4 py-2 bg-emerald-600 text-white rounded">Upload Note</button>

                <button className="px-6 py-3 bg-white text-slate-900 border border-emerald-200 rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-colors">New Class</button>
              </div>
            </header>
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold text-lg mb-4">Create Course</h2>

              <input
                placeholder="Course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />

              <input
                placeholder="Thumbnail URL"
                value={courseThumb}
                onChange={(e) => setCourseThumb(e.target.value)}
                className="border p-2 rounded w-full mb-3 "
              />

              <textarea className="w-full border p-3 rounded
             bg-black text-white placeholder:text-gray-400
             focus:bg-white focus:text-black
             focus:placeholder:text-gray-500
             transition-all duration-200" placeholder="Description" value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
              {/* Course Pricing */}
              <div className="mt-4 space-y-3">

                <label className="font-semibold text-slate-700">
                  Course Type
                </label>

                <div className="flex gap-6 items-center">

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPaid}
                      onChange={() => {
                        setIsPaid(false);
                        setPrice("");
                      }}
                    />
                    Free
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                    />
                    Paid
                  </label>

                </div>

                {isPaid && (
                  <input
                    type="number"
                    placeholder="Set Course Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                )}

              </div>

              <button
                onClick={createCourse}
                disabled={!courseTitle.trim() || !courseThumb.trim() || !courseDesc.trim()}
                className={`mt-3 px-4 py-2 rounded text-white transition
    ${(!courseTitle.trim() || !courseThumb.trim() || !courseDesc.trim())
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                Create Course
              </button>
            </div>
           

            <div className=" mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h3 className="text-xl font-bold mb-8">Study Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {teacherNotes.map(note => {
                      console.log("NOTE DATA:", note);
                      return (
                        <div key={note._id} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative h-fit">
                          <div className="absolute top-6 right-6 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black">{note.fileType}</div>
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2} /></svg>
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg mb-2">{note.title}</h4>
                          <p className="text-xs text-slate-400">
                            Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-400 mb-6">
                            Class : {note.topicId?.classId?.name}
                          </p>
                          <p className="text-xs text-slate-400 mb-6">
                            Topic: {note.topicId?.name}
                          </p>
                          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">

                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              {note.downloads || 0} Downloads
                            </span>

                            <div className="flex items-center gap-5 text-sm font-semibold">

                              <a
                                href={`http://localhost:5000${note.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 transition"
                              >
                                Download
                              </a>

                              <button
                                onClick={async () => {
                                  setEditingNote(note);
                                  setEditTitle(note.title);
                                  setEditTopic(note.topicId?._id);

                                  // IMPORTANT: fetch topics of that note's class
                                  const classId = note.topicId?.classId?._id;

                                  const res = await fetch(`http://localhost:5000/api/topics/${classId}`, {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem("token")}`
                                    }
                                  });

                                  const data = await res.json();
                                  setEditTopics(data);
                                }}
                                className="text-emerald-600 font-semibold text-xs"
                              >
                                Edit
                              </button>



                              <button
                                onClick={async () => {
                                  if (!confirm("Delete this note?")) return;

                                  await fetch(`http://localhost:5000/api/notes/${note._id}`, {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem("token")}`
                                    }
                                  });

                                  loadNotes();
                                }}
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                Delete
                              </button>

                            </div>
                          </div>





                        </div>
                      );
                    })}

                  </div>
                </section>
              </div>

              <div className="relative rounded-[2.5rem] p-7 sm:p-8 text-white overflow-hidden shadow-2xl
bg-gradient-to-br from-[#0b132b] via-[#0d1b2a] to-[#1b263b] flex flex-col gap-6 self-start">

                {/* glow orb */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />

                {/* title */}
                <h4 className="text-2xl font-extrabold flex items-center gap-3 tracking-tight">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Summarizer
                </h4>

                {/* description */}
                <p className="text-slate-300 text-sm leading-relaxed">
                  Instantly generate bullet-point summaries for your complex teaching modules.
                </p>

                {/* button */}
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="w-full py-4 rounded-2xl font-bold
    bg-white text-slate-900
    hover:scale-[1.02] hover:shadow-xl hover:shadow-white/20
    active:scale-[0.98]
    transition-all duration-200
    disabled:opacity-60"
                >
                  {isSummarizing ? "Analyzing Content..." : "Summarize Folder"}
                </button>

                {/* summary output */}
                {aiSummary && (
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 animate-fade-in">
                    <p className="text-xs text-slate-300 leading-relaxed">{aiSummary}</p>
                  </div>
                )}

              </div>

              

            </div>

            {editingNote && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl w-[400px] space-y-4">

                  <h2 className="text-xl font-bold">Edit Note</h2>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />

                  <select
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    {editTopics.map((t: any) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setEditingNote(null)} className="px-4 py-2 bg-gray-200 rounded">
                      Cancel
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(`http://localhost:5000/api/notes/${editingNote._id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                          },
                          body: JSON.stringify({ title: editTitle, topicId: editTopic })
                        });
                        setEditingNote(null);
                        loadNotes();
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div >


      </div >
    );
  };

  export default TeacherDashboard;
