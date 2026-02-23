const HelpCenter = () => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-black text-slate-900 mb-10">Help Center</h1>

        <div className="space-y-6 text-slate-700">
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow">
            <h3 className="font-bold text-lg mb-2">How do I enroll in a subject?</h3>
            <p>Login → Open Subjects → Click Enroll.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow">
            <h3 className="font-bold text-lg mb-2">How do I download notes?</h3>
            <p>Open dashboard → Study Materials → Click download.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow">
            <h3 className="font-bold text-lg mb-2">Forgot password?</h3>
            <p>Use Forgot Password on login page and check terminal reset link.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
