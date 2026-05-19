import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState("video");
  const [lessonContent, setLessonContent] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [editMode, setEditMode] = useState(false);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [editCourse, setEditCourse] = useState({
    title: "",
    description: "",
    thumbnail: ""
  });
  const location = useLocation();
  const [modules, setModules] = useState([]);
const [selectedModuleId, setSelectedModuleId] = useState("");
 const [quizQuestions, setQuizQuestions] = useState([
  { question:"", type:"single", options:["",""], correctAnswers:[] }
]);
  const [quizOptions, setQuizOptions] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    age: "",
    studentClass: currentUser?.studentClass || currentUser?.class || "",
    phone: "",
    amount: ""
  });
  const isTeacher = currentUser?.role === "teacher";

  const navigate = useNavigate();
  // load all available courses
  useEffect(() => {
    fetch(`${API}/api/courses`)
      .then(res => res.json())
      .then(data => {
        // console.log("Fetched courses:", data);
        setCourses(data);
        setLoading(false);
      });
  }, []);

 useEffect(() => {
  if (!currentUser || currentUser.role !== "student") return;

  const fetchEnrollments = async () => {
    const res = await fetch(
      `${API}/api/enrollments/my`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setEnrolledIds([]);
      return;
    }

    const ids = data.map((course: any) =>
      course._id.toString()
    );

    setEnrolledIds(ids);
  };

  fetchEnrollments();
}, [successMessage]);   // 👈 ADD THIS

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const editId = params.get("edit");

  if (editId && courses.length > 0) {
    const courseToEdit = courses.find(c => c._id === editId);

    if (courseToEdit) {
      setSelectedCourse(courseToEdit);
      setEditMode(true);
      setShowForm(true);
      setShowContent(false);

      setEditCourse({
        title: courseToEdit.title || "",
        description: courseToEdit.description || "",
        thumbnail: courseToEdit.thumbnail || ""
      });
    }
  }
}, [location.search, courses]);

useEffect(() => {
  const handler = () => {
    const lesson = JSON.parse(localStorage.getItem("editingLesson") || "null");
    if (!lesson) return;

    setSelectedCourse({ _id: lesson.courseId });
    setEditMode(true);
    setShowForm(true);
    setShowContent(true);

    setModuleName("");
    setLessonTitle(lesson.title);
    setLessonType(lesson.type);
    setLessonContent(lesson.content || "");
    setEditingLessonId(lesson._id);
  };

  window.addEventListener("editLesson", handler);
  return () => window.removeEventListener("editLesson", handler);
}, []);

useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [successMessage]);
  const enroll = async (courseId: string) => {
    const res = await fetch(`${API}/api/enrollments/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

   if (res.ok) {
  setSuccessMessage("Successfully enrolled!");

  //  Immediately update enrolledIds
  setEnrolledIds(prev => [...prev, courseId.toString()]);

  setShowForm(false);
}
    else alert(data.message);
  };

 const handlePaidEnrollment = async (course: any) => {
  if (!course.price || course.price === 0) {
    await enroll(course._id);
    return;
  }

  const confirmPay = window.confirm(
    `Simulate payment of ₹${course.price}?`
  );

  if (!confirmPay) return;

  const res = await fetch(
    `${API}/api/enrollments/payments/simulate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        courseId: course._id
      })
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    alert("Payment simulation failed");
    return;
  }

  //  Only enroll if simulation succeeded
  await enroll(course._id);
};

  if (loading) return <div className="p-10">Loading courses...</div>;
  const getImage = (path: string) => {
    if (!path) return "/no-image.png";

    // BASE64 image (your case)
    if (path.startsWith("data:image")) return path;

    // external url
    if (path.startsWith("http")) return path;

    // uploaded image
    return `${API}${path}`;
  };

  const isOwner = (course: any) => {
    if (!currentUser) return false;

    // teacherId can be object or string
    const teacherId =
      typeof course.teacherId === "object"
        ? course.teacherId?._id
        : course.teacherId;

    return teacherId?.toString() === currentUser.id;
  };
const addQuestion = () => {
  setQuizQuestions(prev => [
    ...prev,
    { question:"", type:"single", options:["",""], correctAnswers:[] }
  ]);
};
  return (
    
    <div className="max-w-6xl mx-auto p-10">
      {successMessage && (
  <div className="fixed top-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
    {successMessage}
  </div>
)}
      <h1 className="text-3xl font-black mb-8 text-emerald-50">
        Available Courses
      </h1>
{/* Section Heading */}
<div className="text-center mb-12">
  <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent tracking-tight">
    Explore Our Courses
  </h2>

  <p className="mt-4 text-emerald-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
    We provide carefully designed courses to help you build real-world skills and grow confidently in your learning journey.
  </p>

  {/* Decorative Line */}
  <div className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
</div>

      <div className="grid md:grid-cols-3 gap-8">
        {courses.map(course => (
          
          <div key={course._id} className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg transition">

            {/* Thumbnail */}
            <div className="h-44 bg-slate-100 overflow-hidden">
              <img
                src={getImage(course.thumbnail)}
                alt={course.title}
                className="w-full h-full object-cover"
              />

            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {course.title}
              </h2>
              <button
               onClick={() => navigate(`/course/${course._id}`)}
                className="mt-3 w-full py-2 border border-[#069B6C] text-[#069B6C] rounded-xl hover:bg-[#069B6C] hover:text-white transition"
              >
                View Course
              </button>
              <p className="text-sm text-slate-600 mt-2 max-h-[60px] overflow-hidden whitespace-pre-line">
                {course.description}
              </p>
              {isTeacher && isOwner(course) ? (
                <div className="mt-4 flex gap-2">

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setEditMode(true);
                      setShowForm(true);
                      setShowContent(false); // start hidden

                      setEditCourse({
                        title: course.title || "",
                        description: course.description || "",
                        thumbnail: course.thumbnail || ""
                      });
                    }}
                    className="mt-4 w-full py-3 bg-[#069B6C] hover:bg-[#047a56] text-white rounded-xl transition-all duration-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm("Delete this course?")) return;

                      await fetch(`${API}/api/courses/${course._id}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                      });

                      setCourses(prev => prev.filter(c => c._id !== course._id));
                    }}
                    className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                  >
                    Remove
                  </button>

                </div>
              ) : (
           <div className="mt-4 flex items-center justify-end gap-3">

<button
  onClick={() => {
    if (enrolledIds.includes(course._id.toString())) {
      alert("You have already enrolled in this course.");
      return;
    }

    setSelectedCourse(course);
    setEditMode(false);
    setForm(prev => ({
      ...prev,
      amount: course.price || 0
    }));
    setShowForm(true);
  }}
  className={`py-2 px-6 rounded-lg transition-all duration-200 ${
    enrolledIds.includes(course._id.toString())
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-[#069B6C] hover:bg-[#047a56] text-white"
  }`}
  disabled={enrolledIds.includes(course._id.toString())}
>
  {enrolledIds.includes(course._id.toString()) ? "Enrolled" : "Enroll"}
</button>

  <span className="px-3 py-1 text-sm font-semibold rounded-full 
                   bg-gradient-to-r from-emerald-100 to-emerald-200 
                   text-emerald-800 shadow-sm">
    {course.price > 0 ? `₹ ${course.price}` : "Free"}
  </span>

</div>
              )}


            </div>

          </div>
        ))}
      </div>
      {showForm && (
       <div
  className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
  onClick={() => setShowForm(false)}
>
   <div
  className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
  onClick={(e) => e.stopPropagation()}
>

     {/* HEADER */}
      <div className="p-5 border-b">
            <h2 className="text-xl font-bold">
              {editMode ? "Edit Course" : `Enroll in ${selectedCourse?.title}`}
            </h2>
</div>
 {/* SCROLLABLE CONTENT */}
<div className="p-6 space-y-4 overflow-y-auto">
            {editMode ? (
              <>
                {/* TEACHER EDIT FORM */}
                <input
                  className="w-full border p-2 rounded"
                  value={editCourse.title}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                  placeholder="Course Title"
                />
               <button
  onClick={() => {
    const next = !showContent;
    setShowContent(next);

    // when opening content → load modules
    if (next) {
      fetch(`${API}/api/modules/${selectedCourse._id}`)
        .then(res => res.json())
        .then(data => setModules(data))
        .catch(() => setModules([]));
    }
  }}
  className="w-full py-2 bg-indigo-600 text-white rounded mt-2"
>
  {showContent ? "Hide Content" : "Manage Content"}
</button>
                {/* Lesson Creator */}
                {showContent && (
                  <div className="border-t pt-4 space-y-3">

                    <h3 className="font-bold text-lg">Add Lesson</h3>

                    <input
                      placeholder="Module Name"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    />

                    <input
                      placeholder="Lesson Title"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    />

                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value)}
                      className="w-full border px-3 py-2 rounded text-white"
                    >
                      <option value="video">Video</option>
                      <option value="note">Note</option>
                      <option value="quiz">Quiz</option>
                    </select>

                    {/* VIDEO */}
                    {lessonType === "video" && (
                      <input
                        placeholder="Paste YouTube URL"
                        value={lessonContent}
                        onChange={(e) => setLessonContent(e.target.value)}
                        className="w-full border px-3 py-2 rounded text-black"
                      />
                    )}

                    {/* NOTE TEXT */}
                    {lessonType === "note" && (
                      <div className="space-y-2">

                        <textarea
                          placeholder="Write note text (optional)"
                          value={lessonContent}
                          onChange={(e) => setLessonContent(e.target.value)}
                          className="w-full border px-3 py-2 rounded text-white"
                        />

                        <input
                          type="file"
                          accept=".pdf,.docx,.pptx"
                          onChange={(e) => setLessonFile(e.target.files?.[0] || null)}
                          className="w-full border px-3 py-2 rounded bg-white"
                        />

                        <p className="text-xs text-gray-500">
                          You can upload PDF / DOCX / PPT or just write text note
                        </p>

                      </div>
                    )}

                    {/* QUIZ BUILDER */}
                   {lessonType === "quiz" && (
  <div className="space-y-6">

    {quizQuestions.map((q, qIndex) => (
      <div key={qIndex} className="border rounded-xl p-4 space-y-3 bg-gray-50">

        <input
          placeholder={`Question ${qIndex + 1}`}
          value={q.question}
          onChange={(e) => {
            const copy = [...quizQuestions];
            copy[qIndex].question = e.target.value;
            setQuizQuestions(copy);
          }}
          className="w-full border px-3 py-2 rounded"
        />

        {/* QUESTION TYPE */}
        <select
          value={q.type}
          onChange={(e) => {
            const copy = [...quizQuestions];
            copy[qIndex].type = e.target.value;
            copy[qIndex].options = ["", ""];
            copy[qIndex].correctAnswers = [];
            setQuizQuestions(copy);
          }}
          className="w-full border px-3 py-2 rounded text-white"
        >
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
          <option value="text">Text Answer</option>
        </select>

        {/* OPTIONS (only for choice types) */}
        {(q.type === "single" || q.type === "multiple") && (
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">

                <input
                  type={q.type === "single" ? "radio" : "checkbox"}
                  checked={q.correctAnswers.includes(opt)}
                  onChange={() => {
                    const copy = [...quizQuestions];

                    if (q.type === "single") {
                      copy[qIndex].correctAnswers = [opt];
                    } else {
                      if (copy[qIndex].correctAnswers.includes(opt))
                        copy[qIndex].correctAnswers =
                          copy[qIndex].correctAnswers.filter(a => a !== opt);
                      else
                        copy[qIndex].correctAnswers.push(opt);
                    }

                    setQuizQuestions(copy);
                  }}
                />

                <input
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => {
                    const copy = [...quizQuestions];
                    copy[qIndex].options[i] = e.target.value;
                    setQuizQuestions(copy);
                  }}
                  className="flex-1 border px-3 py-2 rounded"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const copy = [...quizQuestions];
                copy[qIndex].options.push("");
                setQuizQuestions(copy);
              }}
              className="text-sm text-blue-600"
            >
              + Add option
            </button>
          </div>
        )}

        {/* TEXT ANSWER */}
        {q.type === "text" && (
          <input
            placeholder="Correct Answer"
            value={q.correctAnswers[0] || ""}
            onChange={(e) => {
              const copy = [...quizQuestions];
              copy[qIndex].correctAnswers = [e.target.value];
              setQuizQuestions(copy);
            }}
            className="w-full border px-3 py-2 rounded"
          />
        )}

        <button
          type="button"
          onClick={() =>
            setQuizQuestions(quizQuestions.filter((_, i) => i !== qIndex))
          }
          className="text-red-500 text-sm"
        >
          Remove Question
        </button>

      </div>
    ))}

    <button
      type="button"
      onClick={addQuestion}
      className="px-4 py-2 bg-gray-200 rounded"
    >
      + Add Another Question
    </button>

  </div>
)}
                    <button
                     onClick={async () => {
  try {

    /* ---------- TOKEN FIX ---------- */
    const rawToken = localStorage.getItem("token");
    let token = rawToken;

    if (rawToken) {
      try {
        const parsed = JSON.parse(rawToken);
        token = parsed?.token || parsed;
      } catch {
        token = rawToken; // already a plain JWT string
      }
    }
// 🔴 ADD THIS BLOCK
if (!lessonTitle || !lessonTitle.trim()) {
  alert("Please enter lesson title");
  return;
}

if (!moduleName || !moduleName.trim()) {
  alert("Please enter module name");
  return;
}
    /* ---------- FORM DATA ---------- */
    const formData = new FormData();
    formData.append("moduleName", moduleName);
    formData.append("title", lessonTitle);
    formData.append("type", lessonType);

    if (lessonType === "video") {
      formData.append("content", lessonContent);
    }

    if (lessonType === "note") {
      if (lessonContent) formData.append("content", lessonContent);
      if (lessonFile) formData.append("file", lessonFile);
    }

    if (lessonType === "quiz") {
  formData.append("quiz", JSON.stringify(quizQuestions));
}

    /* ---------- API CALL ---------- */
   const url = editingLessonId
  ? `${API}/api/lessons/${editingLessonId}`
  : `${API}/api/lessons/${selectedCourse._id}`;

const method = editingLessonId ? "PUT" : "POST";

const res = await fetch(url, {
  method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);

    if (!res.ok) {
      alert("Failed: " + text);
      return;
    }

    alert("Lesson Added Successfully!");
setEditingLessonId(null);
    /* RESET FORM */
    setModuleName("");
    setLessonTitle("");
    setLessonContent("");
    setLessonFile(null);
   setQuizQuestions([
  { question:"", type:"single", options:["",""], correctAnswers:[] }
]); 
    setQuizOptions(["", ""]);
    setCorrectAnswer(0);

  } catch (err) {
    console.error(err);
    alert("Lesson upload crashed");
  }
}} className="w-full mt-4
    bg-gradient-to-r from-emerald-600 to-teal-500
    hover:from-emerald-700 hover:to-teal-600
    text-white font-semibold
    px-4 py-2.5 rounded-xl
    shadow-md hover:shadow-lg
    transition-all duration-200
    active:scale-[0.97]
    disabled:opacity-50 disabled:cursor-not-allowed">
                      Add Lesson
                    </button>

                    <textarea
                      className="w-full border p-3 rounded
             bg-black text-white placeholder:text-gray-400
             focus:bg-white focus:text-black
             focus:placeholder:text-gray-500
             transition-all duration-200"
                      value={editCourse.description}
                      onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                      placeholder="Description"
                    />

                    <input
                      className="w-full border p-2 rounded"
                      value={editCourse.thumbnail}
                      onChange={(e) => setEditCourse({ ...editCourse, thumbnail: e.target.value })}
                      placeholder="Thumbnail URL"
                    />
                  </div>
                )}</>)
              : (
                <>
                  {/* STUDENT ENROLL FORM */}
                  <input
                    className="w-full border p-2 rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                  />

                  <input
                    className="w-full border p-2 rounded"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                  />

                  <input
                    className="w-full border p-2 rounded"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="Age"
                  />

                  <input
                    className="w-full border p-2 rounded"
                    value={form.studentClass}
                    onChange={(e) => setForm({ ...form, studentClass: e.target.value })}
                    placeholder="Class"
                  />

                  <input
                    className="w-full border p-2 rounded"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone"
                  />

                  <input
                    className="w-full border p-2 rounded"
                    value={form.amount > 0 ? `₹ ${form.amount}` : "Free"} readOnly
              
                    placeholder="Amount to Pay"
                  />
                </>)}
</div> {/*End of scrollable content */}
{/* Footer */}
           <div className="border-t p-4 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
        onClick={async () => {
  const id = selectedCourse?._id;

  if (editMode) {
    await fetch(`${API}/api/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(editCourse)
    });

    setCourses(prev =>
      prev.map(c => c._id === id ? { ...c, ...editCourse } : c)
    );
    localStorage.setItem("courseUpdated", Date.now().toString());
  } else {
 if (!form.name || !form.email || !form.age || !form.studentClass || !form.phone) {
  alert("Please fill all required fields");
  return;
}

await handlePaidEnrollment(selectedCourse);
  }

  // WAIT FOR DOM UPDATE THEN CLOSE MODAL
  setTimeout(() => {
    setShowForm(false);
    setEditMode(false);
    setSelectedCourse(null);
  }, 0);
}}
                className="px-4 py-2 bg-[#069B6C] text-white rounded"
              >

                {editMode ? "Save Changes" : "Confirm Enrollment"}
              </button>
            </div>

          </div>
        </div>)}

    </div>
  );

};