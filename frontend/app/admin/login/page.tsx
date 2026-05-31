"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, CornerDownLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const meRes = await fetch(`${API_URL}/api/v1/auth/me/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const meData = await meRes.json();

      if (!meRes.ok || !meData.is_superuser) {
        setError("Access Denied. You do not have administrator privileges.");
        setLoading(false);
        return;
      }

      login(data.access, data.refresh, "/admin");
    } catch {
      setError("A network error occurred. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left panel: branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#0a0a0a] p-12 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orb */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-white/80 font-bold tracking-tight text-sm">CampusCrate Admin</span>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-6 bg-indigo-500/60" />
            <span className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-[0.15em]">Restricted Access</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Admin<br />Control Panel
          </h1>
          <p className="text-[14px] text-white/40 font-medium leading-relaxed max-w-[260px]">
            Authorised personnel only. All access attempts are logged and monitored.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-white/30 font-medium">Systems Operational</span>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 bg-[#f7f7f7] flex items-center justify-center p-6">
        <div className="w-full max-w-[390px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">CampusCrate Admin</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[1.65rem] font-black text-gray-900 tracking-tight mb-1">Sign in</h2>
            <p className="text-[14px] text-gray-400 font-medium">Enter your admin credentials to access the panel.</p>
          </div>

          <form className="space-y-4" onSubmit={handleCredentialsLogin}>
            {error && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 text-red-700 rounded-xl text-[13px] font-medium border border-red-100">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@campuscrate.edu"
                className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-[0.85rem] pl-11 pr-4 py-3.5 text-[14.5px] font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-[0.85rem] pl-11 pr-12 py-3.5 text-[14.5px] font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold text-[14.5px] py-3.5 rounded-[0.85rem] transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 mt-2 group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <CornerDownLeft className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-700 transition-colors">
              ← Back to CampusCrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
