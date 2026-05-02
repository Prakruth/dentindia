"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminAuth } from "@/lib/adminData";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (password === correctPassword) {
      setAdminAuth("authenticated");
      router.push("/admin/clinics");
    } else {
      setError("Invalid password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-teal-600 flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Dent<span className="text-teal-600">Admin</span>
          </h1>
          <p className="text-stone-600 text-sm mt-2">Clinic Management Portal</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border-2 border-stone-200 p-8 shadow-lg"
        >
          <h2 className="font-semibold text-stone-900 text-lg mb-6">Admin Login</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition disabled:bg-stone-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading || !password
                ? "bg-stone-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login to Admin"
            )}
          </button>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-stone-600">
              <span className="font-medium">Demo Password:</span> admin123
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 mt-6">
          This is a password-protected admin area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
