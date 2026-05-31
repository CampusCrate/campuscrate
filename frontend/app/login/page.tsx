"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.detail || "Failed to login. Please check your credentials.");
        setLoading(false);
      } else {
        login(data.access, data.refresh);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Disabled / Unimplemented for now
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[26rem]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>
        
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Log in</h1>
            <p className="text-[14px] text-gray-400 font-medium tracking-tight">Welcome back to CampusCrate.</p>
          </div>
          
          <button onClick={handleGoogleLogin} type="button" className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[14px] py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all mb-6 relative overflow-hidden group">
            <svg className="w-5 h-5 absolute left-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.31-1 2.41-2.12 3.14v2.6h3.43c2.01-1.85 3.17-4.58 3.17-7.75Z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.43-2.6c-.98.66-2.23 1.05-3.85 1.05-2.96 0-5.46-2-6.36-4.69H2.07v2.68C3.89 20.4 7.64 23 12 23Z" fill="#34A853"/>
              <path d="M5.64 14.1c-.24-.7-.37-1.46-.37-2.1s.13-1.4.37-2.1V7.22H2.07C1.38 8.6 1 10.23 1 12s.38 3.4.11 4.78l3.53-2.68Z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.64 1 3.89 3.6 2.07 7.22l3.57 2.68c.9-2.69 3.4-4.52 6.36-4.52Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Or email</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <form className="space-y-5" onSubmit={handleCredentialsLogin}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#f8f9fa] border border-transparent hover:border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[12px] font-bold text-gray-400 hover:text-gray-900 transition-colors">Forgot?</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#f8f9fa] border border-transparent hover:border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </div>
            
            <button disabled={loading} className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] mt-4">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          
          <p className="mt-8 text-center text-[13px] text-gray-400 font-medium">
            Don't have an account? <Link href="/signup" className="text-gray-900 font-bold hover:underline transition-all">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
