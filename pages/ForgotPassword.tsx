import { useState } from "react";
const API = import.meta.env.VITE_API_URL;
export default function ForgotPassword({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
const API = import.meta.env.VITE_API_URL;
  const sendLink = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setSent(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-white via-emerald-50/30 to-white px-4 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -mr-48 opacity-50"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-emerald-50/30 rounded-full blur-3xl -ml-40 opacity-40"></div>

      <div className="max-w-md w-full z-10 animate-fade-in">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-emerald-600/40">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Reset Password</h2>
            <p className="text-slate-500 text-sm">Enter your email to receive a reset link</p>
          </div>

          {/* Success Message */}
          {sent && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-slide-in-up">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-emerald-900 font-bold mb-1">Check your email!</p>
                  <p className="text-emerald-800 text-sm">
                    We've sent a password reset link to <span className="font-bold">{email}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-in-up">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {!sent ? (
            <>
              {/* Email Input */}
              <div className="mb-8">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Email Address</label>
                <input
                  type="email"
                  placeholder="your@example.com"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/50 text-black placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendLink()}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={sendLink}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-600/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentPage("login")}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-600/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider"
            >
              Back to Login
            </button>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500 font-medium">Remember your password?</span>
            </div>
          </div>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => setCurrentPage("login")}
            className="w-full py-3 border-2 border-emerald-200 text-emerald-600 rounded-xl font-black text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 uppercase tracking-wider"
          >
            Sign In
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-8 font-medium">
          Check your email inbox and spam folder
        </p>
      </div>
    </div>
  );
}
