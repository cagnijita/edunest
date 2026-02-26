import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function CoursePlayer({ courseId }: { courseId?: string }) {
  const params = useParams();
  const id = courseId || params.id;


  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [error, setError] = useState("");
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
const [reloadKey, setReloadKey] = useState(0);
const [editingLesson, setEditingLesson] = useState(null);
const [editTitle, setEditTitle] = useState("");
const [completedLessons, setCompletedLessons] = useState<string[]>([]);

const [editContent, setEditContent] = useState("");
useEffect(() => {
  setModules([]);
  setActiveLesson(null);
  setCourse(null);
}, [id]);

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("completedLessons") || "[]");
  setCompletedLessons(stored);
}, []);

// useEffect(() => {
//   const storedUser = localStorage.getItem("user");
//   if (storedUser) {
//     const parsed = JSON.parse(storedUser);
//     if (parsed.role?.toLowerCase() === "teacher") {
//       setIsTeacher(true);
//     }
//   }
// }, []);
  const loadLesson = async (lessonId: string) => {
    console.log("CLICKED LESSON:", lessonId );
    try {
      if (!localStorage.getItem("token")) {
        setError("Login to watch this lesson");
        setActiveLesson(null);
        return;
      }
const user = JSON.parse(localStorage.getItem("user") || "null");

if (user?.role === "student" && !isEnrolled) {
  setError("Please enroll in this course to access lessons");
  setActiveLesson(null);
  return;
}
      const res = await fetch(`${API}/api/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const fullLesson = await res.json();
     setActiveLesson({ ...fullLesson });
      setError("");

    } catch {
      setError("Failed to load lesson");
    }
  };

useEffect(() => {
  if (!id) return;

  const loadCourse = async () => {
    const res = await fetch(`${API}/api/courses/preview/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    setCourse(data);
    setModules(data.modules || []);
    setIsEnrolled(data.isEnrolled);
  };

  loadCourse();

}, [id]);

const [initialLoaded, setInitialLoaded] = useState(false);

useEffect(() => {
  if (!modules.length || initialLoaded) return;

  const firstModule = modules[0];
  if (!firstModule?.lessons?.length) return;

  loadLesson(firstModule.lessons[0]._id);
  setInitialLoaded(true);

}, [modules, initialLoaded]);

  useEffect(() => {
  const handler = () => setReloadKey(Date.now());

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}, []);
  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    // youtu.be/abc
    if (url.includes("youtu.be/"))
      return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];

    // mobile youtube
    if (url.includes("m.youtube.com"))
      return "https://www.youtube.com/embed/" + url.split("v=")[1];

    // watch?v=
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/");

    // already embed
    if (url.includes("/embed/"))
      return url;

    return null;
  };

  useEffect(() => {
  console.log("ACTIVE LESSON CHANGED:", activeLesson);
}, [activeLesson]);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!activeLesson) return;
  if (user?.role !== "student") return;

  const requiredWatchTime = 5000;

  const timer = setTimeout(() => {
    console.log("Timer completed → calling API");
    markLessonCompleted(activeLesson._id);
  }, requiredWatchTime);

  return () => clearTimeout(timer);

}, [activeLesson]);
const markLessonCompleted = async (lessonId: string) => {
  if (completedLessons.includes(lessonId)) return;

  try {
    console.log("Sending completion request...");

    const res = await fetch(`${API}/api/courses/complete-lesson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        lessonId,
        courseId: id
      })
    });

    const data = await res.json();

    console.log("New progress:", data.progress);

    // ✅ update completed lessons locally
    setCompletedLessons(prev => [...prev, lessonId]);

    // ✅ VERY IMPORTANT: reload course to get updated progress
    const courseRes = await fetch(`${API}/api/courses/preview/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const updatedCourse = await courseRes.json();

    setCourse(updatedCourse);

  } catch (err) {
    console.error("Completion failed:", err);
  }
};


  return (
    <div className="pt-28 pb-24 bg-gradient-to-b from-emerald-50 via-emerald-100/40 to-emerald-200/40 min-h-screen">

      {/* COURSE HEADER */}
      {course && (
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="rounded-3xl p-[1px] bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600">
            <div className="bg-white rounded-3xl p-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {course.title}
              </h1>
              <p className="text-slate-600 leading-relaxed">
                {course.description}
              </p>
              



 


            </div>
          </div></div>
      )}

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* LEFT — SYLLABUS */}
        <div className="bg-emerald-50/70 backdrop-blur rounded-3xl border border-emerald-200 p-6 h-fit shadow-sm">
         <div className="flex items-center justify-between mb-6">
  <h2 className="text-xl font-bold text-slate-900">
    Course Content
  </h2>

  {course?.teacherId === JSON.parse(localStorage.getItem("user"))?.id && (
  <div className="flex gap-3 mb-4">
    <button
      onClick={() => window.location.href = `/?page=courses&edit=${course._id}`}
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
    >
      + Add Module
    </button>

    <button
      onClick={() => window.location.href = `/?page=courses&edit=${course._id}`}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
    >
      + Add Lesson
    </button>
  </div>
)}
</div>

          {modules.map((module, mIndex) => (
            <div key={module._id || mIndex} className="mb-4">

       {/* MODULE TITLE */}
<div className="flex justify-between items-center font-bold text-emerald-700 mb-2">
  <span>{mIndex + 1}. {module.title}</span>

  {course?.teacherId === JSON.parse(localStorage.getItem("user"))?.id && (
    <div className="flex gap-2">

      {/* RENAME MODULE */}
      <button
        onClick={() => {
          console.log("MODULE CLICKED:", module);

          const newName = prompt("Enter new module name", module.title);
          if (!newName) return;

          fetch(`${API}/api/modules/${module._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ title: newName })
          }).then(() => window.location.reload());
        }}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        ✏️
      </button>

      {/* DELETE MODULE */}
      <button
        onClick={async () => {
          if (!confirm("Delete this module and all its lessons?")) return;

          await fetch(`${API}/api/modules/${module._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          setReloadKey(Date.now());
        }}
        className="text-xs text-red-600 hover:text-red-800"
      >
        🗑
      </button>

    </div>
  )}
</div>

              {/* LESSONS */}
              {module.lessons.map((lesson: any, lIndex: number) => (
                <div

                  key={lesson._id || `${mIndex}-${lIndex}`}
                  onClick={() => loadLesson(lesson._id)}
                  className={`ml-4 p-3 rounded-lg mb-2 cursor-pointer border transition-all
        ${activeLesson?._id === lesson._id
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "hover:bg-emerald-100 border-emerald-200"}`}
                >
           <div className="flex justify-between items-center">
  <span>{mIndex + 1}.{lIndex + 1} {lesson.title}</span>

  {course?.teacherId === JSON.parse(localStorage.getItem("user"))?.id && (
    <div className="flex gap-2 items-center">

      {/* EDIT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEditingLesson(lesson);
          setEditTitle(lesson.title);
          setEditContent(lesson.content || "");
        }}
        className="text-xs text-emerald-700 hover:text-emerald-900"
      >
        ✏️
      </button>

      {/* DELETE */}
      <button
        onClick={async (e) => {
          e.stopPropagation();

          if (!confirm("Delete this lesson?")) return;

          await fetch(`${API}/api/lessons/${lesson._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          window.location.reload();
        }}
        className="text-xs text-red-600 hover:text-red-800"
      >
        🗑
      </button>

    </div>
  )}
</div>
                </div>
              ))}

            </div>
          ))}
        </div>


        {/* RIGHT — PLAYER / PREVIEW */}
        <div className="md:col-span-2 bg-gradient-to-b from-white to-emerald-50 rounded-3xl shadow-lg border border-emerald-100 p-6 min-h-[500px]">

          {/* ERROR / LOCK MESSAGE */}
         {!activeLesson && (
  <div className="h-full flex flex-col items-center justify-center text-center">

    {JSON.parse(localStorage.getItem("user") || "null")?.role === "student" && !isEnrolled ? (
      <>
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Access Restricted
        </h3>
        <p className="text-slate-600 max-w-md">
          Please enroll in this course to access the lessons.
        </p>
      </>
    ) : (
      <>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full mb-6"></div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Course Preview
        </h3>
        <p className="text-slate-600 max-w-md">
          Select a lesson to start learning.
        </p>
      </>
    )}

    {error && (
      <div className="mt-6 bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-xl">
        {error}
      </div>
    )}

  </div>
)}

          {/* VIDEO */}

         {activeLesson?.type === "video" && getEmbedUrl(activeLesson.content) && (
  <iframe
    className="w-full h-[500px] rounded-xl"
    src={getEmbedUrl(activeLesson.content)!}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
)}

         {/* NOTE */}
{activeLesson?.type === "note" && (
  <div className="space-y-4">

    {/* Text note (if teacher wrote something) */}
    {activeLesson.content && (
      <div className="prose max-w-none whitespace-pre-line">
        {activeLesson.content}
      </div>
    )}

    {/* File attachment */}
    {activeLesson.fileUrl && (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="font-semibold text-emerald-700 mb-2">
          Attached File
        </p>

        <a
          href={`http://localhost:5000${activeLesson.fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          📄 Open / Download File
        </a>
      </div>
    )}

    {/* Preview PDF only (browser supports) */}
    {activeLesson.fileUrl?.endsWith(".pdf") && (
      <iframe
        src={`http://localhost:5000${activeLesson.fileUrl}`}
        className="w-full h-[500px] rounded-xl border mt-4"
      />
    )}

  </div>
)}

   
{activeLesson?.type === "quiz" && (

  !activeLesson.quiz || activeLesson.quiz.length === 0 ? (

    <div className="text-center text-xl font-semibold text-emerald-600 mt-10">
      Quiz coming soon...
    </div>

  ) : (

    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-emerald-700">Quiz</h2>

      {activeLesson.quiz.map((q: any, qIndex: number) => (
        <div key={qIndex} className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">

          {/* QUESTION */}
          <p className="font-semibold text-lg mb-4">
            {qIndex + 1}. {q.question}
          </p>

          {/* SINGLE */}
          {q.type === "single" && q.options?.map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-3 mb-2 cursor-pointer">
              <input type="radio" name={`q-${qIndex}`} className="accent-emerald-600" />
              <span>{opt}</span>
            </label>
          ))}

          {/* MULTIPLE */}
          {q.type === "multiple" && q.options?.map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-3 mb-2 cursor-pointer">
              <input type="checkbox" className="accent-emerald-600" />
              <span>{opt}</span>
            </label>
          ))}

          {/* TEXT */}
          {q.type === "text" && (
            <input
              type="text"
              placeholder="Your answer..."
              className="w-full border px-3 py-2 rounded-lg"
            />
          )}

        </div>
      ))}

      <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
        Submit Quiz
      </button>
    </div>

  )
)}

        </div>
      </div>
    {editingLesson && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-[400px] space-y-3">

      <h2 className="text-lg font-bold">Edit Lesson</h2>

      <input
        className="w-full border p-2 rounded"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded text-white"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setEditingLesson(null)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await fetch(`${API}/api/lessons/${editingLesson._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({
                title: editTitle,
                content: editContent,
                type: editingLesson.type
              })
            });

            setEditingLesson(null);
            window.location.reload();
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}
    {/* {showModuleModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4">

      <h2 className="text-lg font-bold">Add Module</h2>

      <input
        type="text"
        placeholder="Module Title"
        value={newModuleTitle}
        onChange={(e) => setNewModuleTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowModuleModal(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={createModule}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Create
        </button>
      </div>

    </div>
  </div>
)} */}
{/* {showLessonModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4">

      <h2 className="text-lg font-bold">Add Lesson</h2>

      <select
        value={selectedModuleId}
        onChange={(e) => setSelectedModuleId(e.target.value)}
        className="w-full border p-2 rounded text-white"
      >
        <option value="">Select Module</option>
        {modules.map((m: any) => (
          <option key={m._id} value={m._id}>
            {m.title}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Lesson Title"
        value={newLessonTitle}
        onChange={(e) => setNewLessonTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowLessonModal(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={createLesson}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Create
        </button>
      </div>

    </div>
  </div>
)} */}
    </div>
  );
}