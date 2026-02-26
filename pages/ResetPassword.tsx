import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL;
const ResetPassword = ({ onNavigate }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("resetToken");

    try {
      const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      localStorage.removeItem("resetToken");
      setLoading(false);
      setTimeout(() => onNavigate("login"), 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create New Password</h2>
            <p className="text-slate-500 text-sm">Enter your new password below</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-slide-in-up">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-emerald-900 font-bold mb-1">Password Reset Successfully!</p>
                  <p className="text-emerald-800 text-sm">Redirecting to login...</p>
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

          {!success && (
            <>
              {/* Form */}
              <form onSubmit={handleReset} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/50 text-black placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/50 text-black placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Password Requirements:</p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className={password.length >= 6 ? "text-emerald-600" : "text-slate-400"}>✓</span>
                      At least 6 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={password === confirmPassword && password ? "text-emerald-600" : "text-slate-400"}>✓</span>
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="w-full py-3 mt-8 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-600/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Update Password
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

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
                onClick={() => onNavigate("login")}
                className="w-full py-3 border-2 border-emerald-200 text-emerald-600 rounded-xl font-black text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 uppercase tracking-wider"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-8 font-medium">
          Your password will be securely encrypted
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
